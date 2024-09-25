'use client'
import { useEffect } from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/ThemeProvider";
import Loader from "./components/Loader/Loader";
import { useLoadUserQuery } from "./redux/features/api/apiSlice";
import { Providers } from "./Provider";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import socketIO from 'socket.io-client';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-Roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.variable} suppressHydrationWarning={true}>
        <NextTopLoader showSpinner={false} />
        <Providers>
          {/* <ProtectedRoute> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
              <Loading>
                {children}
              </Loading>
              <Toaster position="top-center" reverseOrder={false} />
            </SessionProvider>
          </ThemeProvider>
          {/* </ProtectedRoute> */}
        </Providers>
      </body>
    </html>
  );
}

const Loading = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    socketId.on('connection', () => {});
  }, []);

  return (
    <>
      {
        isLoading ? <Loader /> : <>{children}</>
      }
    </>
  )
}
