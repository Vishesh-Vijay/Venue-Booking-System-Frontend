import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
// import { AuthContextProvider } from "./context/AuthContext";
const inter = Inter({ subsets: ["latin"] });
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Venue Booker",
  description: "A venue booking system for IIITA",
};

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Venue Booking System</title>
      </head>
      <body className={poppins.variable}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        <Toaster />
      </body>
    </html>
  );
}
