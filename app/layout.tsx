
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
// import { AuthContextProvider } from "./context/AuthContext";
const inter = Inter({ subsets: ["latin"] });

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
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
