import { redirect } from "next/navigation";
import UserAuth from "./UserAuth";

export default function Protected({ children }) {
    const isAuthenticated = UserAuth();
    return isAuthenticated ? children : redirect("/");
}