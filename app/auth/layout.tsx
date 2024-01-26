'use client'
import React from "react";
import Image from "next/image";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-[100vh] flex justify-around items-center">
      <div className="h-[100vh] bg-[#7298C6] w-3/4 space-y-6 flex justify-center items-center">
        <div>
          <div className="flex justify-center h-3/4 w-auto">
            <Image src="/logo.png" alt="App icon" width={250} height={250} />
          </div>
          <div className="text-white font-bold text-4xl mt-2 flex justify-center space-x-2 items-center">
            <span className="text-[#313465]">Venue</span>
            <h1>Booker</h1>
          </div>
          <div className="text-white mt-8 font-semibold text-lg">
            A Venue Booking App for events in IIIT Allahabad
          </div>
        </div>
      </div>
      <div className="w-1/2 h-[100vh] bg-white flex justify-around items-center">
       {children}
      </div>
    </div>
  );
};

export default AuthLayout;
