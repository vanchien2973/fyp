import express from "express";
import { activateUser, assignRoleUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAvatar, updatePassword, updateToken, updateUser } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/AuthMiddleware";
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/activate", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh", updateToken, getUserInfo);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-profile", isAuthenticated, updateUser);

userRouter.put("/update-user-password", isAuthenticated, updatePassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateAvatar);

userRouter.get("/get-all-users", isAuthenticated, authorizeRoles('admin'), getAllUsers);

userRouter.put("/assign-user-role", isAuthenticated, authorizeRoles('admin'), assignRoleUser);

userRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles('admin'), deleteUser);

export default userRouter;