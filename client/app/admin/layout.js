'use client'
import { ThemeProviderAdmin } from "../utils/ThemeAdmin";

export default function AdminLayout({ children }) {
  return (
    <ThemeProviderAdmin>
      {children}
    </ThemeProviderAdmin>
  )
}