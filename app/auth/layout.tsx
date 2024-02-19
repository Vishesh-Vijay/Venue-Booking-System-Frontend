"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token != null) {
            setShow(false);
            router.push("/");
        } else {
            setShow(true);
        }
    }, [router]);
    return (
        show && (
            <div className="flex flex-col md:flex-row h-screen">
                <div className="md:w-1/2 bg-[#7298C6] flex flex-col justify-center items-center h-full">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/logo.png"
                                alt="App icon"
                                width={250}
                                height={250}
                            />
                        </div>
                        <div className="text-white font-bold text-4xl mt-2 flex justify-center space-x-2 items-center">
                            <span className="text-[#313465]">Venue</span>
                            <h1>Booker</h1>
                        </div>
                        <div className="text-white mt-8 font-semibold text-lg">
                            A Venue Booking App for IIIT Allahabad
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 bg-white flex flex-col justify-center items-center md:mb-0 mb-6 h-full">
                    {children}
                </div>
            </div>
        )
    );
};

export default AuthLayout;
