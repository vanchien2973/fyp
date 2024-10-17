import express from "express";
import { updateToken } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { createEntranceTest, deleteEntranceTest, getAllEntranceTests, getEntranceTestById, takeEntranceTest, updateEntranceTest } from "../controllers/entranceTest.controller";
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const entranceTest = express.Router();

entranceTest.post('/create-test', upload.any(), updateToken, isAuthenticated, authorizeRoles('admin'), createEntranceTest);

entranceTest.post('/:testId/take', upload.any(), updateToken, isAuthenticated, takeEntranceTest);

entranceTest.get('/all-test', isAuthenticated, updateToken, authorizeRoles('admin'), getAllEntranceTests);

entranceTest.delete('/entrance-test/:id', updateToken, isAuthenticated, authorizeRoles('admin'), deleteEntranceTest);

entranceTest.put('/entrance-test/:id', updateToken, isAuthenticated, authorizeRoles('admin'), updateEntranceTest);

entranceTest.get('/entrance-test/:id', updateToken, isAuthenticated, authorizeRoles('admin'), getEntranceTestById);

export default entranceTest;