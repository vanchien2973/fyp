import { ThemeProviderAdmin } from "../utils/ThemeAdmin";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderAdmin>
          {children}
        </ThemeProviderAdmin>
      </body>
    </html>
  )
}