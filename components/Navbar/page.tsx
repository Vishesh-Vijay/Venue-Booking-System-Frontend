import React from "react";
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
import DropdownComponent from "../Dropdown Menu/page";
const NavBar = () => {
  return (
    <Navbar shouldHideOnScroll className=" border border-b-black text-white p-4">
      <NavbarContent className="flex justify-between items-center">
        <NavbarItem isActive>
          <Link
            href="https://iiita.ac.in"
            aria-current="page"
            className="flex justify-center items-center"
          >
            <Image src="/iiita.png" alt="iiita" width={40} height={40} />
            <p className="text-white">IIIT Allahabad</p>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem isActive>
          <DropdownComponent />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
