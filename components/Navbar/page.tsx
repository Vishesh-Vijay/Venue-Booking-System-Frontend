import React from 'react'
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
const NavBar = () => {
  return (
    <Navbar shouldHideOnScroll className="bg-[#7298C6] text-white">
      <NavbarBrand>
        <Image src="/logo.png" alt="logo" width={30} height={30} />
        <p className="font-bold text-inherit ml-2 text-xl">
          <span className="text-[#313465] mr-1">Venue</span>
          Booker
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="https://iiita.ac.in" aria-current="page" className='flex justify-center items-center'>
            <Image 
              src="/iiita.png"
              alt="iiita"
              width={40}
              height={40} 
            />
            <p className='text-white'>IIIT Allahabad</p>
          </Link>
        </NavbarItem> 
      </NavbarContent>
      
    </Navbar>
  );
}

export default NavBar
