'use client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
const HomePage = () => {
  const router = useRouter();
  function toTitleCase(str:string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  const name = localStorage.getItem("name"); 
  return (
    <div className="p-3">
      <div className="text-3xl font-semibold">
        Welcome{" "}
        <span className="font-semibold text-[#]">
          {toTitleCase(name as string)}!!{" "}
        </span>
      </div>
    </div>
  );
}

export default HomePage;