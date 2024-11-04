import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: String,
    isCorrect: Boolean
});

const matchingPairSchema = new mongoose.Schema({
    left: String,
    right: String
});

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multipleChoice', 'trueFalse', 'shortAnswer', 'essay', 'fillInTheBlank', 'matching', 'ordering', 'selectFromDropdown'],
        required: true
    },
    options: [optionSchema],
    matchingPairs: [matchingPairSchema],
    orderItems: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    points: {
        type: Number,
        default: 1
    },
    audioFile: { type: String, default: null },
    imageFile: { type: String, default: null },
});

const passageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    audioFile: { type: String, default: null },
    imageFile: { type: String, default: null },
    questions: [questionSchema],
});

const sectionSchema = new mongoose.Schema({
    name: String,
    description: String,
    timeLimit: Number,
    passages: [passageSchema],
    questions: [questionSchema],
});

const entranceTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    testType: {
        type: String,
        required: true
    },
    sections: [sectionSchema],
    totalTime: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EntranceTestModel = mongoose.model("EntranceTest", entranceTestSchema);

export default EntranceTestModel;