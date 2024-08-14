import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object]
});

const linkSchema = new mongoose.Schema({
    title: String,
    url: String,
});

const commentSchema = new mongoose.Schema({
    user: Object,
    question: String,
    questionReplies: [Object],
});

const courseDataSchema = new mongoose.Schema({
    videoUrl: String,
    // videoThumbnail: Object,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;
