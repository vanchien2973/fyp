'use client'
import React from "react";
import { ThemeProvider as  NextThemesProvider} from "@material-tailwind/react";

export function ThemeProvider({ children, ...props }) {
    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    );
}