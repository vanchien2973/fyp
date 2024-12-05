import express from "express";
import { updateToken } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { createEntranceTest, deleteEntranceTest, getAllEntranceTests, getEntranceTestById, getTestRecommendations, takeEntranceTest, updateEntranceTest } from "../controllers/entranceTest.controller";
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
});

const entranceTest = express.Router();

entranceTest.post('/create-test', upload.any(), isAuthenticated, authorizeRoles('admin'), createEntranceTest);

entranceTest.post('/take-test/:testId', isAuthenticated, takeEntranceTest);

entranceTest.get('/tests', getAllEntranceTests);

entranceTest.get('/all-test', isAuthenticated, authorizeRoles('admin'), getAllEntranceTests);

entranceTest.delete('/entrance-test/:id', isAuthenticated, authorizeRoles('admin'), deleteEntranceTest);

entranceTest.put('/entrance-test/:id', upload.any(), isAuthenticated, authorizeRoles('admin'), updateEntranceTest);

entranceTest.get('/entrance-test/:id', isAuthenticated, authorizeRoles('admin'), getEntranceTestById);

export default entranceTest;