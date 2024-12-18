import express from "express";
import { updateToken } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
import { createLayout, editLayout, getLayout } from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post('/create-layout', isAuthenticated, authorizeRoles('admin'), createLayout);

layoutRouter.put('/update-layout', isAuthenticated, authorizeRoles('admin'), editLayout);

layoutRouter.get('/get-layout/:type', getLayout);

export default layoutRouter;