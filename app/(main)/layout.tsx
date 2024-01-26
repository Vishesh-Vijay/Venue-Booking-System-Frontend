'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Poppins } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import NavBar from "@/components/Navbar/page";
import Sidebar from "@/components/Sidebar/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      setShow(false);
      router.push("/auth/login");
    } else {
      setShow(true);
    }
  }, [router]);
  return (
    show && (<div className="w-full h-[100vh] flex justify-between items-center">
      <div className="w-1/4 h-full">
        <Sidebar />
      </div>

      <div className="w-full h-full flex flex-col justify-between items-center">
        <NavBar /> 
        <NextUIProvider className="w-full h-full  overflow-y-scroll">
          <div className="w-full h-full">{children}</div>
        </NextUIProvider>
      </div>
    </div>)
  );
}
