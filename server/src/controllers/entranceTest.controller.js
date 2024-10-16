import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import EntranceTestModel from "../models/entranceTest.model";
import cloudinary from "cloudinary";
import UserModel from "../models/user.model";
import LayoutModel from "../models/layout.model";
import CourseModel from "../models/course.model"; 
import mongoose from "mongoose";

export const createEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { title, description, testType, totalTime, passingScore, sections } = req.body;

        if (!title || !description || !testType || !totalTime || !passingScore || !sections) {
            return next(new ErrorHandler('Missing required fields', 400));
        }

        let parsedSections;
        try {
            parsedSections = JSON.parse(sections);
            if (!Array.isArray(parsedSections)) {
                throw new Error('Sections must be an array');
            }
        } catch (error) {
            return next(new ErrorHandler(`Invalid sections data: ${error.message}`, 400));
        }

        const updatedSections = await handleFileUploads(parsedSections, req.files);

        const newTest = await EntranceTestModel.create({
            title,
            description,
            testType,
            sections: updatedSections,
            totalTime: Number(totalTime),
            passingScore: Number(passingScore)
        });

        res.status(201).json({
            success: true,
            message: "Entrance test created successfully",
            test: newTest
        });
    } catch (error) {
        console.error('Error in createEntranceTest:', error);
        return next(new ErrorHandler(`Error creating entrance test: ${error.message}`, 500));
    }
});

const handleFileUploads = async (sections, files) => {
    const uploadFile = async (file, folder) => {
        if (file && file.path) {
            try {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: `entrance_tests/${folder}`,
                    resource_type: "auto"
                });
                return result.secure_url;
            } catch (error) {
                console.error(`Error uploading file:`, error);
                return null;
            }
        }
        return null;
    };

    return Promise.all(sections.map(async (section) => {
        if (Array.isArray(section.questions)) {
            section.questions = await Promise.all(section.questions.map(async (question) => {
                const audioFileKey = `sections[${sections.indexOf(section)}].questions[${section.questions.indexOf(question)}].audioFile`;
                const imageFileKey = `sections[${sections.indexOf(section)}].questions[${section.questions.indexOf(question)}].imageFile`;
                
                if (files && files[audioFileKey] && files[audioFileKey][0]) {
                    question.audioFile = await uploadFile(files[audioFileKey][0], 'audio');
                } else {
                    question.audioFile = null;
                }
                
                if (files && files[imageFileKey] && files[imageFileKey][0]) {
                    question.imageFile = await uploadFile(files[imageFileKey][0], 'images');
                } else {
                    question.imageFile = null;
                }
                
                return question;
            }));
        }

        if (Array.isArray(section.passages)) {
            section.passages = await Promise.all(section.passages.map(async (passage) => {
                if (Array.isArray(passage.questions)) {
                    passage.questions = await Promise.all(passage.questions.map(async (question) => {
                        const audioFileKey = `sections[${sections.indexOf(section)}].passages[${section.passages.indexOf(passage)}].questions[${passage.questions.indexOf(question)}].audioFile`;
                        const imageFileKey = `sections[${sections.indexOf(section)}].passages[${section.passages.indexOf(passage)}].questions[${passage.questions.indexOf(question)}].imageFile`;
                        
                        if (files && files[audioFileKey] && files[audioFileKey][0]) {
                            question.audioFile = await uploadFile(files[audioFileKey][0], 'audio');
                        } else {
                            question.audioFile = null;
                        }
                        
                        if (files && files[imageFileKey] && files[imageFileKey][0]) {
                            question.imageFile = await uploadFile(files[imageFileKey][0], 'images');
                        } else {
                            question.imageFile = null;
                        }
                        
                        return question;
                    }));
                }
                return passage;
            }));
        }

        return section;
    }));
};

export const updateEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, testType, totalTime, passingScore, sections } = req.body;

        let entranceTest = await EntranceTestModel.findById(id);

        if (!entranceTest) {
            return next(new ErrorHandler("Entrance test not found", 404));
        }

        if (title) entranceTest.title = title;
        if (description) entranceTest.description = description;
        if (testType) entranceTest.testType = testType;
        if (totalTime) entranceTest.totalTime = Number(totalTime);
        if (passingScore) entranceTest.passingScore = Number(passingScore);

        if (sections) {
            let parsedSections;
            try {
                parsedSections = JSON.parse(sections);
                if (!Array.isArray(parsedSections)) {
                    throw new Error('Sections must be an array');
                }
            } catch (error) {
                return next(new ErrorHandler(`Invalid sections data: ${error.message}`, 400));
            }

            const updatedSections = await handleFileUploads(parsedSections, req.files);
            entranceTest.sections = updatedSections;
        }

        await entranceTest.save();

        res.status(200).json({
            success: true,
            message: "Entrance test updated successfully",
            test: entranceTest
        });
    } catch (error) {
        console.error('Error in updateEntranceTest:', error);
        return next(new ErrorHandler(`Error updating entrance test: ${error.message}`, 500));
    }
});

// Delete Entrance Test
export const deleteEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler("Invalid entrance test ID", 400));
        }

        const test = await EntranceTestModel.findById(id);
        
        if (!test) {
            return next(new ErrorHandler("Entrance test not found", 404));
        }

        // Delete associated files from Cloudinary
        for (let section of test.sections) {
            for (let question of section.questions) {
                if (question.audioFile) {
                    try {
                        const audioPublicId = question.audioFile.split('/').pop().split('.')[0];
                        await cloudinary.v2.uploader.destroy(audioPublicId, { resource_type: "audio" });
                    } catch (cloudinaryError) {
                        console.error("Cloudinary audio deletion error:", cloudinaryError);
                    }
                }
                if (question.imageFile) {
                    try {
                        const imagePublicId = question.imageFile.split('/').pop().split('.')[0];
                        await cloudinary.v2.uploader.destroy(imagePublicId, { resource_type: "image" });
                    } catch (cloudinaryError) {
                        console.error("Cloudinary image deletion error:", cloudinaryError);
                    }
                }
            }
        }

        await EntranceTestModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Entrance test and associated files deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
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