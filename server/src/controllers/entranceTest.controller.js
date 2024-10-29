import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import EntranceTestModel from "../models/entranceTest.model";
import UserModel from "../models/user.model";
import LayoutModel from "../models/layout.model";
import CourseModel from "../models/course.model";
import { deleteAllSectionFiles, handleFileUploads } from "../services/entranceTest.service";

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

// Update Entrance Test 
export const updateEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        console.log('req.params:', req.params);
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        const { id } = req.params;
        const { title, description, testType, totalTime, sections } = req.body;

        // Input validation
        if (!id || !title || !description || !testType || !totalTime || !sections) {
            return next(new ErrorHandler('Missing required fields', 400));
        }

        let parsedSections;
        try {
            parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
        } catch (error) {
            return next(new ErrorHandler('Invalid sections data format: ' + error.message, 400));
        }

        const existingTest = await EntranceTestModel.findById(id);
        console.log('existingTest:', existingTest);
        if (!existingTest) {
            return next(new ErrorHandler(`Entrance test with ID ${id} not found`, 404));
        }

        const oldSections = JSON.parse(JSON.stringify(existingTest.sections));

        let newSections;
        try {
            newSections = await handleFileUploads(parsedSections, req.files || []);
            console.log('newSections:', newSections);
        } catch (uploadError) {
            await deleteAllSectionFiles(oldSections);
            return next(new ErrorHandler(`File upload failed: ${uploadError.message}`, 500));
        }

        const updateData = {
            title,
            description,
            testType,
            sections: newSections,
            totalTime: Number(totalTime),
            updatedAt: new Date()
        };

        const updatedTest = await EntranceTestModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        console.log('updatedTest:', updatedTest);
        
        if (!updatedTest) {
            await deleteAllSectionFiles(newSections);
            return next(new ErrorHandler('Database update failed', 500));
        }

        await deleteAllSectionFiles(oldSections);

        return res.status(200).json({
            success: true,
            message: "Entrance test updated successfully",
            test: updatedTest
        });
    } catch (error) {
        console.error('Unexpected error during test update:', error);
        return next(new ErrorHandler(`Failed to update entrance test: ${error.message}`, 500));
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