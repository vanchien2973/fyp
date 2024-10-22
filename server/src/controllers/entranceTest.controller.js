import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import EntranceTestModel from "../models/entranceTest.model";
import UserModel from "../models/user.model";
import LayoutModel from "../models/layout.model";
import CourseModel from "../models/course.model";
import mongoose from "mongoose";
import { promisify } from 'util';
import fs from 'fs';
import { deleteAllSectionFiles, handleFileUploads } from "../services/entranceTest.service";

const unlinkAsync = promisify(fs.unlink);

// Create Entry Test
export const createEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { title, description, testType, totalTime, sections } = req.body;

        if (!title || !description || !testType || !totalTime || !sections) {
            return next(new ErrorHandler('Missing required fields', 400));
        }

        let parsedSections;
        try {
            parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
            
            if (!Array.isArray(parsedSections)) {
                return next(new ErrorHandler('Sections must be an array', 400));
            }

            for (const section of parsedSections) {
                if (!section.name || !section.description || !section.timeLimit) {
                    return next(new ErrorHandler('Each section must have name, description, and timeLimit', 400));
                }
            }
        } catch (parseError) {
            return next(new ErrorHandler(`Invalid JSON in sections: ${parseError.message}`, 400));
        }

        // Process sections and upload files
        const processedSections = await handleFileUploads(parsedSections, req.files);

        const newTest = await EntranceTestModel.create({
            title,
            description,
            testType,
            sections: processedSections,
            totalTime: Number(totalTime),
        });

        res.status(201).json({
            success: true,
            message: "Entrance test created successfully",
            test: newTest
        });
    } catch (error) {
        return next(new ErrorHandler(`Error creating entrance test: ${error.message}`, 500));
    }
});

// Delete Entrance Test
export const deleteEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const test = await EntranceTestModel.findById(id);
        if (!test) {
            return next(new ErrorHandler('Entrance test not found', 404));
        }

        // Delete all associated files
        const deletionResult = await deleteAllSectionFiles(test.sections);
        if (!deletionResult) {
            return next(new ErrorHandler('Error deleting associated files', 500));
        }

        const { failedDeletions, successfulDeletions } = deletionResult;

        // Delete the test document
        await EntranceTestModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Entrance test deleted successfully",
            deletionSummary: {
                successfulDeletions: successfulDeletions.length,
                failedDeletions: failedDeletions.length > 0 ? failedDeletions : undefined
            }
        });
    } catch (error) {
        return next(new ErrorHandler(`Error deleting entrance test: ${error.message}`, 500));
    }
});

// Compare and handle file updates
const handleFileUpdate = async (oldFile, newFile, folder) => {
    if (newFile) {
        if (oldFile) {
            await deleteCloudinaryFile(oldFile);
        }
        return await uploadFile(newFile, folder);
    }
    return oldFile;
};

// Helper function to process section updates
const processUpdateSections = async (oldSections, newSections, files) => {
    const parsedNewSections = typeof newSections === 'string' ? JSON.parse(newSections) : newSections;
    
    return await Promise.all(parsedNewSections.map(async (newSection, sectionIndex) => {
        const oldSection = oldSections[sectionIndex];

        // Process passages
        if (Array.isArray(newSection.passages)) {
            newSection.passages = await Promise.all(newSection.passages.map(async (newPassage, passageIndex) => {
                const oldPassage = oldSection?.passages?.[passageIndex];

                // Handle passage files
                const passageAudioKey = `sections[${sectionIndex}].passages[${passageIndex}].audioFile`;
                const passageImageKey = `sections[${sectionIndex}].passages[${passageIndex}].imageFile`;

                const audioFile = files?.find(f => f.fieldname === passageAudioKey);
                const imageFile = files?.find(f => f.fieldname === passageImageKey);

                const audioUrl = await handleFileUpdate(
                    oldPassage?.audioFile,
                    audioFile,
                    'audio'
                );

                const imageUrl = await handleFileUpdate(
                    oldPassage?.imageFile,
                    imageFile,
                    'images'
                );

                // Process questions within passages
                const questions = await Promise.all((newPassage.questions || []).map(async (newQuestion, questionIndex) => {
                    const oldQuestion = oldPassage?.questions?.[questionIndex];

                    const questionAudioKey = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].audioFile`;
                    const questionImageKey = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].imageFile`;

                    const qAudioFile = files?.find(f => f.fieldname === questionAudioKey);
                    const qImageFile = files?.find(f => f.fieldname === questionImageKey);

                    const questionAudioUrl = await handleFileUpdate(
                        oldQuestion?.audioFile,
                        qAudioFile,
                        'audio'
                    );

                    const questionImageUrl = await handleFileUpdate(
                        oldQuestion?.imageFile,
                        qImageFile,
                        'images'
                    );

                    return {
                        ...newQuestion,
                        audioFile: questionAudioUrl,
                        imageFile: questionImageUrl
                    };
                }));

                return {
                    ...newPassage,
                    audioFile: audioUrl,
                    imageFile: imageUrl,
                    questions
                };
            }));
        }

        // Process standalone questions
        if (Array.isArray(newSection.questions)) {
            newSection.questions = await Promise.all(newSection.questions.map(async (newQuestion, questionIndex) => {
                const oldQuestion = oldSection?.questions?.[questionIndex];

                const audioKey = `sections[${sectionIndex}].questions[${questionIndex}].audioFile`;
                const imageKey = `sections[${sectionIndex}].questions[${questionIndex}].imageFile`;

                const audioFile = files?.find(f => f.fieldname === audioKey);
                const imageFile = files?.find(f => f.fieldname === imageKey);

                const audioUrl = await handleFileUpdate(
                    oldQuestion?.audioFile,
                    audioFile,
                    'audio'
                );

                const imageUrl = await handleFileUpdate(
                    oldQuestion?.imageFile,
                    imageFile,
                    'images'
                );

                return {
                    ...newQuestion,
                    audioFile: audioUrl,
                    imageFile: imageUrl
                };
            }));
        }

        return newSection;
    }));
};

// Update Entrance Test
export const updateEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, testType, totalTime, sections } = req.body;

        // Find the existing test
        const existingTest = await EntranceTestModel.findById(id);
        if (!existingTest) {
            return next(new ErrorHandler('Entrance test not found', 404));
        }

        let processedSections;
        if (req.files && Array.isArray(req.files)) {
            // Process sections with file updates
            processedSections = await processUpdateSections(
                existingTest.sections,
                sections,
                req.files
            );
        } else {
            // If no files to update, parse sections as is
            processedSections = JSON.parse(sections);
        }

        // Update the test
        const updatedTest = await EntranceTestModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                testType,
                sections: processedSections,
                totalTime: Number(totalTime),
            },
            { new: true, runValidators: true }
        );

        // Clean up any temporary files
        if (req.files) {
            for (const file of req.files) {
                if (file.path) {
                    try {
                        await unlinkAsync(file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting temporary file:', unlinkError);
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            message: "Entrance test updated successfully",
            test: updatedTest
        });
    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                if (file.path) {
                    try {
                        await unlinkAsync(file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting temporary file:', unlinkError);
                    }
                }
            }
        }
        return next(new ErrorHandler(`Error updating entrance test: ${error.message}`, 500));
    }
});

export const takeEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { testId } = req.params;
        const { userId, answers } = req.body;

        const test = await EntranceTestModel.findById(testId);
        if (!test) {
            return next(new ErrorHandler("Entrance test not found", 404));
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        let totalScore = 0;
        let sectionScores = {};
        let detailedResults = [];

        test.sections.forEach(section => {
            let sectionScore = 0;

            const processQuestions = (questions, passageIndex = null) => {
                questions.forEach(question => {
                    const userAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
                    if (!userAnswer) return;

                    let isCorrect = false;
                    let score = 0;

                    switch (question.type) {
                        case 'multipleChoice':
                        case 'trueFalse':
                            isCorrect = question.correctAnswer === userAnswer.answer;
                            score = isCorrect ? question.points : 0;
                            break;
                        case 'shortAnswer':
                        case 'essay':
                            // For these types, we might need manual grading later
                            score = 0;
                            isCorrect = null; // To be determined
                            break;
                        case 'fillInTheBlank':
                            isCorrect = question.correctAnswer.toLowerCase() === userAnswer.answer.toLowerCase();
                            score = isCorrect ? question.points : 0;
                            break;
                        case 'matching':
                            isCorrect = JSON.stringify(question.correctAnswer) === JSON.stringify(userAnswer.answer);
                            score = isCorrect ? question.points : 0;
                            break;
                        case 'ordering':
                            isCorrect = JSON.stringify(question.correctAnswer) === JSON.stringify(userAnswer.answer);
                            score = isCorrect ? question.points : 0;
                            break;
                        case 'selectFromDropdown':
                            isCorrect = question.correctAnswer === userAnswer.answer;
                            score = isCorrect ? question.points : 0;
                            break;
                    }

                    sectionScore += score;
                    totalScore += score;

                    detailedResults.push({
                        section: section.name,
                        passageIndex,
                        questionId: question._id,
                        userAnswer: userAnswer.answer,
                        isCorrect,
                        score,
                        maxScore: question.points
                    });
                });
            };

            processQuestions(section.questions);
            section.passages.forEach((passage, index) => processQuestions(passage.questions, index));

            sectionScores[section.name] = sectionScore;
        });

        const testResult = {
            test: testId,
            score: totalScore,
            sectionScores,
            detailedResults,
            takenAt: new Date()
        };

        user.entranceTestResults.push(testResult);
        await user.save();

        // Generate course recommendations based on test results
        const recommendations = await generateRecommendations(sectionScores, totalScore);

        res.status(200).json({
            success: true,
            message: "Entrance test completed successfully",
            testResult,
            recommendations
        });
    } catch (error) {
        console.error("Error in takeEntranceTest:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get All Entrance Tests (for admin)
export const getAllEntranceTests = CatchAsyncError(async (req, res, next) => {
    try {
        const tests = await EntranceTestModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tests
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Entrance Test by ID
export const getEntranceTestById = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const test = await EntranceTestModel.findById(id);

        if (!test) {
            return next(new ErrorHandler("Entrance test not found", 404));
        }

        res.status(200).json({
            success: true,
            test
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

const generateRecommendations = async (sectionScores, totalScore) => {
    const sectionNames = Object.keys(sectionScores);

    if (!sectionNames || sectionNames.length === 0) {
        console.error("No section scores provided");
        return { recommendedCourses: [], recommendedSections: [] };
    }

    const categories = await LayoutModel.find(
        {
            title: { $in: sectionNames },
            type: "Categories"
        }
    ).lean();

    if (!categories || categories.length === 0) {
        console.error("No categories found for the given scores");
        return { recommendedCourses: [], recommendedSections: [] };
    }

    const recommendedSections = categories
        .map(category => ({
            ...category,
            score: sectionScores[category.title] || 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    const recommendedCourses = await CourseModel.find({
        'category.title': { $in: recommendedSections.map(cat => cat.title) },
        level: determineLevel(totalScore)
    })
        .sort({ ratings: -1, purchased: -1 })
        .limit(5)
        .lean();

    return { recommendedCourses, recommendedSections };
};

const determineLevel = (score) => {
    if (score < 50) return 'Beginner';
    if (score < 80) return 'Intermediate';
    return 'Advanced';
};