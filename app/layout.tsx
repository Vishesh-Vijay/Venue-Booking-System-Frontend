import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
// import { AuthContextProvider } from "./context/AuthContext";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

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
            <Head>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
            </Head>
            <body className={poppins.variable}>
                <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
            </body>
        </html>
    );
}
