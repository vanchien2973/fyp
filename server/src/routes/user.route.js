import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAvatar, updatePassword, updateToken, updateUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/AuthMiddleware";
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/activate", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh", updateToken);

userRouter.get("/me", updateToken, isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-profile", updateToken, isAuthenticated, updateUser);

userRouter.put("/update-user-password", updateToken, isAuthenticated, updatePassword);

userRouter.put("/update-user-avatar", updateToken, isAuthenticated, updateAvatar);

// route + updateToken

export default userRouter;