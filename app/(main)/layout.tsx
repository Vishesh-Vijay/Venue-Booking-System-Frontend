"use client";
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
import { getUserDetailsByEmail } from "@/utils/utils";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [isAdmin, setIsAdmin] = useState("user");
    useEffect(() => {
        const getUserDetails = async () => {
            // setLoading(true);
            try {
                const email = localStorage.getItem("user");
                const userDetails: any = await getUserDetailsByEmail(
                    email as string,
                    token as string
                ).then((res: any) => {
                    const resp = res;
                    if (resp.status == 200) {
                        const data = resp.data.response_data;
                        // console.log(data);

                        if (data.is_admin) {
                            setIsAdmin("admin");
                            localStorage.setItem("admin", "yes");
                        } else {
                            localStorage.setItem("admin", "no");
                        }
                    }
                });

                // console.log(userDetails);
            } catch (error: any) {
                // Handle error
                console.log(error);
            }
        };
        const token = localStorage.getItem("token");
        if (token == null) {
            setShow(false);
            router.push("/auth/login");
        } else {
            setShow(true);
        }

        getUserDetails();
    }, [router]);
    return (
        show && (
            <div className="w-full h-[100vh] flex justify-between items-center">
                <div className="w-1/4 ">
                    <Sidebar admin={isAdmin} />
                </div>

                <div className="w-full h-full flex flex-col justify-between items-center">
                    <NavBar />
                    <NextUIProvider className="w-full h-full ">
                        <div className="w-full h-full">{children}</div>
                    </NextUIProvider>
                </div>
            </div>
        )
    );
}
