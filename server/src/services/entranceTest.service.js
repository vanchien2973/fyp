import CatchAsyncError from "../middlewares/CatchAsyncError";
import cloudinary from "cloudinary";

// Handle file upload to Cloudinary
export const uploadFile = async (file, folder) => {
    if (!file) {
        return null;
    }

    try {
        // Convert buffer to base64 string
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        const result = await cloudinary.v2.uploader.upload(fileBase64, {
            folder: `entrance_tests/${folder}`,
            resource_type: "auto"
        });

        return result.secure_url;
    } catch (error) {
        console.error('Upload error details:', error);
        throw new Error(`File upload failed: ${error.message}`);
    }
};

export const handleQuestions = async (questions, files, sectionIndex, passageIndex = null) => {
    return await Promise.all(questions.map(async (question, questionIndex) => {
        const prefix = passageIndex !== null 
            ? `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}]`
            : `sections[${sectionIndex}].questions[${questionIndex}]`;

        const audioFile = files?.find(f => f.fieldname === `${prefix}.audioFile`);
        const imageFile = files?.find(f => f.fieldname === `${prefix}.imageFile`);

        return {
            ...question,
            audioFile: audioFile ? await uploadFile(audioFile, 'audio') : null,
            imageFile: imageFile ? await uploadFile(imageFile, 'images') : null
        };
    }));
};

// Helper function to handle file uploads for sections
export const handleFileUploads = async (sections, files) => {
    return await Promise.all(sections.map(async (section, sectionIndex) => {
        // Handle passages
        if (Array.isArray(section.passages)) {
            section.passages = await Promise.all(section.passages.map(async (passage, passageIndex) => {
                const audioFile = files?.find(f => f.fieldname === `sections[${sectionIndex}].passages[${passageIndex}].audioFile`);
                const imageFile = files?.find(f => f.fieldname === `sections[${sectionIndex}].passages[${passageIndex}].imageFile`);

                return {
                    ...passage,
                    audioFile: audioFile ? await uploadFile(audioFile, 'audio') : null,
                    imageFile: imageFile ? await uploadFile(imageFile, 'images') : null,
                    questions: await handleQuestions(passage.questions, files, sectionIndex, passageIndex)
                };
            }));
        }

        // Handle standalone questions
        if (Array.isArray(section.questions)) {
            section.questions = await handleQuestions(section.questions, files, sectionIndex);
        }

        return section;
    }));
};

// Delete Cloudinary file with improved error handling
export const deleteCloudinaryFile = async (fileUrl) => {
    if (!fileUrl) return { success: false, error: 'No file URL provided' };

    try {
        const matches = fileUrl.match(/\/v\d+\/(.+)$/);
        if (!matches || !matches[1]) {
            return { success: false, error: 'Invalid file URL format' };
        }

        const pathAfterVersion = matches[1];
        const publicId = pathAfterVersion.split('.')[0];

        // Determine resource type from URL
        let resourceType = 'image';
        if (fileUrl.includes('/video/')) {
            resourceType = 'video';
        } else if (fileUrl.includes('/raw/')) {
            resourceType = 'raw';
        }

        // Try primary resource type first
        const result = await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });

        if (result.result === 'ok') {
            return { success: true, result };
        }

        // Try alternative resource types if primary fails
        const alternativeTypes = ['image', 'video', 'raw'].filter(type => type !== resourceType);
        for (const type of alternativeTypes) {
            try {
                const retryResult = await cloudinary.v2.uploader.destroy(publicId, {
                    resource_type: type,
                    invalidate: true
                });

                if (retryResult.result === 'ok') {
                    return { success: true, result: retryResult };
                }
            } catch (error) {
                console.error(`Failed to delete with resource type ${type}:`, error);
            }
        }

        return { 
            success: false, 
            error: 'Failed to delete file with all resource types' 
        };
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    }
};

// Enhanced delete all section files with better error handling
export const deleteAllSectionFiles = async (sections) => {
    if (!Array.isArray(sections)) {
        return {
            failedDeletions: [],
            successfulDeletions: [],
            error: 'Invalid sections data'
        };
    }

    const failedDeletions = [];
    const successfulDeletions = [];

    const processFile = async (fileUrl, fileType, context) => {
        if (!fileUrl) return;

        try {
            const result = await deleteCloudinaryFile(fileUrl);
            if (result.success) {
                successfulDeletions.push({
                    url: fileUrl,
                    type: fileType,
                    context
                });
            } else {
                failedDeletions.push({
                    url: fileUrl,
                    type: fileType,
                    context,
                    error: result.error
                });
            }
        } catch (error) {
            failedDeletions.push({
                url: fileUrl,
                type: fileType,
                context,
                error: error.message
            });
        }
    };

    try {
        for (const [sectionIndex, section] of sections.entries()) {
            // Handle passages
            if (Array.isArray(section.passages)) {
                for (const [passageIndex, passage] of section.passages.entries()) {
                    const context = `Section ${sectionIndex} - Passage ${passageIndex}`;
                    await processFile(passage.audioFile, 'audio', `${context} - Passage Audio`);
                    await processFile(passage.imageFile, 'image', `${context} - Passage Image`);

                    if (Array.isArray(passage.questions)) {
                        for (const [questionIndex, question] of passage.questions.entries()) {
                            const questionContext = `${context} - Question ${questionIndex}`;
                            await processFile(question.audioFile, 'audio', `${questionContext} - Audio`);
                            await processFile(question.imageFile, 'image', `${questionContext} - Image`);
                        }
                    }
                }
            }

            // Handle standalone questions
            if (Array.isArray(section.questions)) {
                for (const [questionIndex, question] of section.questions.entries()) {
                    const context = `Section ${sectionIndex} - Standalone Question ${questionIndex}`;
                    await processFile(question.audioFile, 'audio', `${context} - Audio`);
                    await processFile(question.imageFile, 'image', `${context} - Image`);
                }
            }
        }
    } catch (error) {
        failedDeletions.push({
            error: `General error processing sections: ${error.message}`
        });
    }

    return {
        failedDeletions,
        successfulDeletions
    };
};