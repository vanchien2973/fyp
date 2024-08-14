'use client'
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/ThemeProvider";
import Loader from "./components/Loader/Loader";
import { useLoadUserQuery } from "./redux/features/api/apiSlice";
import { Providers } from "./Provider";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-Roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={roboto.variable}>
      <Providers>
          <SessionProvider>
            <ThemeProvider>
              <Loading>
                {children}
              </Loading>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Loading = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  return (
    <>
      {
        isLoading ? <Loader /> : <>{children}</>
      }
    </>
  )
}
