import React from 'react'
import Image from "next/image";
const Navbar = () => {
  return (
    <div className="w-full bg-[#7298C6] flex justify-between items-center p-3">
      <div className="flex justify-around items-center space-x-3">
        <div className="flex justify-center items-center h-3/4 w-auto">
          <Image src="/logo.png" alt="App icon" width={30} height={30} />
        </div>
        <div className="text-white font-bold text-4xl flex justify-center space-x-2 items-center">
          <span className="text-[#313465]">Venue</span>
          <h1>Booker</h1>
        </div>
      </div>
    </div>
  );
}

export default Navbar
