import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegexPattern = /^\d{10,15}$/;
const passwordRegexPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: {
            validator: function (email) {
                return emailRegexPattern.test(email);
            },
            message: 'Please provide a valid email',
        },
        unique: true,
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (phoneNumber) {
                return phoneNumberRegexPattern.test(phoneNumber.toString());
            },
            message: 'Please provide a valid phone number',
        }
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function (password) {
                return passwordRegexPattern.test(password);
            },
            message: 'Password must contain at least one number, one lowercase, one uppercase letter, and one special character',
        },
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: 'user',
    },
    courses: [
        {
            courseId: {
                type: String,
                ref: 'Course'
            }
        }
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
    notifications: [
        {
            message: String,
            read: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    entranceTestResults: [{
        test: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'EntranceTest'
            },
            testType: String
        },
        score: Number,
        sectionScores: {
            type: Map,
            of: Number
        },
        detailedResults: [{
            section: String,
            questionId: mongoose.Schema.Types.ObjectId,
            userAnswer: mongoose.Schema.Types.Mixed,
            isCorrect: Boolean,
            score: Number,
            maxScore: Number,
            needsManualGrading: Boolean
        }],
        recommendations: {
            level: String,
            recommendedCourses: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }],
            recommendedSections: [{
                name: String,
                score: Number
            }],
            testType: String
        },
        takenAt: {
            type: Date,
            default: Date.now
        }
    }],
    proficiencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    }
}, { timestamps: true });

// Hash Password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '5m' });
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '3d' });
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;