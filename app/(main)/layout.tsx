'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Poppins } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "@/components/Navbar/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-[100vh] flex justify-between items-center">
      {/* <div className="w-1/4 h-full">
        <Sidebar />
      </div> */}

      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="w-full">
          <Navbar />
        </div>
        <NextUIProvider className="w-full h-full  overflow-y-scroll">
          <div className="w-full h-full">{children}</div>
        </NextUIProvider>
      </div>
    </div>
  );
}
