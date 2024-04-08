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
        <Navbar
            shouldHideOnScroll
            className=" border border-b-black text-white p-3"
        >
            <NavbarContent className="flex justify-between items-center">
                <NavbarItem isActive>
                    <Link
                        href="https://iiita.ac.in"
                        aria-current="page"
                        className="flex justify-center items-center"
                        target="_blank"
                    >
                        <Image
                            src="/iiita.png"
                            alt="iiita"
                            width={45}
                            height={45}
                        />
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
