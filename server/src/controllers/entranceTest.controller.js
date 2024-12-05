import CatchAsyncError from "../middlewares/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import EntranceTestModel from "../models/entranceTest.model";
import UserModel from "../models/user.model";
import LayoutModel from "../models/layout.model";
import CourseModel from "../models/course.model";
import { deleteAllSectionFiles, handleFileUploads } from "../services/entranceTest.service";
import { redis } from "../utils/redis";

// Create Entry Test
export const createEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { title, description, testType, totalTime, sections } = req.body;

        if (!title || !testType || !totalTime || !sections) {
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
        const { id } = req.params;
        const { title, description, testType, totalTime, sections } = req.body;

        if (!id || !title || !testType || !totalTime || !sections) {
            return next(new ErrorHandler('Missing required fields', 400));
        }

        let parsedSections;
        try {
            parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
        } catch (error) {
            return next(new ErrorHandler('Invalid sections data format: ' + error.message, 400));
        }

        const existingTest = await EntranceTestModel.findById(id);

        if (!existingTest) {
            return next(new ErrorHandler(`Entrance test with ID ${id} not found`, 404));
        }

        const oldSections = JSON.parse(JSON.stringify(existingTest.sections));

        let newSections;
        try {
            newSections = await handleFileUploads(parsedSections, req.files || []);
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

// Take Entrance Test
export const takeEntranceTest = CatchAsyncError(async (req, res, next) => {
    try {
        const { testId } = req.params;
        const { answers } = req.body;
        const userId = req.user._id;

        if (!testId || !answers) {
            return next(new ErrorHandler('Missing required fields', 400));
        }

        const test = await EntranceTestModel.findById(testId);
        if (!test) {
            return next(new ErrorHandler('Entrance test not found', 404));
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const sectionScores = {};
        const detailedResults = [];
        let totalScore = 0;
        let totalPoints = 0;

        for (const section of test.sections) {
            let sectionScore = 0;
            let sectionTotalPoints = 0;
            let sectionQuestionCount = 0;

            for (const passage of (section.passages || [])) {
                for (const question of passage.questions) {
                    const userAnswer = answers[question._id];
                    const result = evaluateAnswer(question, userAnswer);
                    
                    if (!result.needsManualGrading) {
                        sectionScore += result.score;
                        sectionTotalPoints += question.points;
                        sectionQuestionCount++;
                    }
                    
                    detailedResults.push({
                        section: section.name,
                        questionId: question._id,
                        userAnswer,
                        isCorrect: result.isCorrect,
                        score: result.score,
                        maxScore: question.points,
                        needsManualGrading: result.needsManualGrading
                    });
                }
            }

            for (const question of (section.questions || [])) {
                const userAnswer = answers[question._id];
                const result = evaluateAnswer(question, userAnswer);
                
                if (!result.needsManualGrading) {
                    sectionScore += result.score;
                    sectionTotalPoints += question.points;
                    sectionQuestionCount++;
                }
                
                detailedResults.push({
                    section: section.name,
                    questionId: question._id,
                    userAnswer,
                    isCorrect: result.isCorrect,
                    score: result.score,
                    maxScore: question.points,
                    needsManualGrading: result.needsManualGrading
                });
            }

            if (sectionTotalPoints > 0) {
                sectionScores[section.name] = (sectionScore / sectionTotalPoints) * 100;
                totalScore += sectionScore;
                totalPoints += sectionTotalPoints;
            } else {
                sectionScores[section.name] = 0;
            }
        }

        const finalScore = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;

        const recommendations = await generateRecommendations(sectionScores, finalScore, testId);

        const testResult = {
            test: {
                _id: testId,
                testType: test.testType
            },
            score: finalScore,
            sectionScores,
            detailedResults,
            recommendations: {
                level: recommendations.level,
                recommendedCourses: recommendations.recommendedCourses.map(course => course._id),
                testType: recommendations.testType
            },
            takenAt: new Date(),
            totalGradablePoints: totalPoints,
            totalGradableScore: totalScore
        };

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: { entranceTestResults: testResult },
                proficiencyLevel: recommendations.level
            },
            { new: true }
        ).populate({
            path: 'entranceTestResults.recommendations.recommendedCourses',
            model: 'Course'
        });
        await redis.set(req.user?._id, JSON.stringify(updatedUser));

        res.status(200).json({
            success: true,
            score: finalScore,
            sectionScores,
            level: recommendations.level,
            recommendations: {
                level: recommendations.level,
                recommendedCourses: recommendations.recommendedCourses.map(course => course._id),
                testType: recommendations.testType
            },
            detailedResults,
            gradableInfo: {
                totalGradablePoints: totalPoints,
                totalGradableScore: totalScore
            }
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

const evaluateAnswer = (question, userAnswer) => {
    if (!userAnswer) {
        return { score: 0, isCorrect: false };
    }

    switch (question.type) {
        case 'multipleChoice':
        case 'selectFromDropdown':
            const correctOption = question.options.find(opt => opt.isCorrect);
            const isCorrect = correctOption && userAnswer === correctOption.text;
            return {
                score: isCorrect ? question.points : 0,
                isCorrect
            };

        case 'trueFalse':
            const boolAnswer = userAnswer === 'true';
            return {
                score: boolAnswer === question.correctAnswer ? question.points : 0,
                isCorrect: boolAnswer === question.correctAnswer
            };

        case 'matching':
            if (Array.isArray(userAnswer) && Array.isArray(question.matchingPairs)) {
                const correctCount = userAnswer.filter((answer, index) => 
                    answer === question.matchingPairs[index]?.right
                ).length;
                const score = (correctCount / question.matchingPairs.length) * question.points;
                return {
                    score,
                    isCorrect: correctCount === question.matchingPairs.length
                };
            }
            return { score: 0, isCorrect: false };

        case 'ordering':
            if (Array.isArray(userAnswer) && Array.isArray(question.orderItems)) {
                const correctOrder = question.orderItems.map((_, index) => index + 1);
                const isCorrect = userAnswer.every((num, index) => num === correctOrder[index]);
                return {
                    score: isCorrect ? question.points : 0,
                    isCorrect
                };
            }
            return { score: 0, isCorrect: false };

        case 'fillInTheBlank':
        case 'shortAnswer':
            const normalizedUserAnswer = userAnswer.toLowerCase().trim();
            const normalizedCorrectAnswer = question.correctAnswer.toLowerCase().trim();
            const isExactMatch = normalizedUserAnswer === normalizedCorrectAnswer;
            return {
                score: isExactMatch ? question.points : 0,
                isCorrect: isExactMatch
            };

        case 'essay':
        case 'speaking':
            return {
                score: 0,
                isCorrect: null,
                needsManualGrading: true
            };

        default:
            return { score: 0, isCorrect: false };
    }
};

// Determine Level
const determineLevel = (score) => {
    if (score >= 80) return "Advanced";
    if (score >= 60) return "Intermediate";
    return "Beginner";
};

// Generate Recommendations
const generateRecommendations = async (sectionScores, totalScore, testId) => {
    try {
        const level = determineLevel(totalScore);
        
        const test = await EntranceTestModel.findById(testId);
        if (!test) {
            return {
                level,
                recommendedCourses: [],
                testType: null
            };
        }

        const recommendedCourses = await CourseModel.find({
            rank: level,
            'category.title': test.testType
        }).limit(5);

        return {
            level,
            recommendedCourses,
            testType: test.testType
        };
    } catch (error) {
        return {
            level: determineLevel(totalScore),
            recommendedCourses: [],
            testType: null
        };
    }
};

