import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { HiOutlineHome } from "react-icons/hi2";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { RiBook2Line } from "react-icons/ri";
import { MdOutlinePostAdd } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { VscRequestChanges } from "react-icons/vsc";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegBuilding } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

interface SidebarProps {
    admin: Boolean;
    authority: Boolean;
}
const Sidebar = ({ admin, authority }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const channels = [
        "Channel 1",
        "Channel 2",
        "Channel 3",
        "Channel 4",
        "Channel 5",
    ];

    return (
        <div className=" min-h-screen bg-[#598dcd]  text-[#fff]">
            <div className="pt-4">
                <div className="px-3 ">
                    <div className="flex flex-col justify-evenly items-center gap-1 my-4 mt-16">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={50}
                            height={50}
                        />
                        <p className="font-bold text-inherit ml-2 text-xl text-white">
                            <span className="text-[#313465] mr-1">Venue</span>
                            Booker
                        </p>
                    </div>
                </div>
                <ScrollArea className="mt-4">
                    <div className="px-3 py-2">
                        <h2 className=" px-4 text-lg font-semibold ">
                            Explore
                        </h2>
                        <div className="space-y-1 px-3 mt-2">
                            <Button
                                variant={
                                    pathname === "/" ? "secondary" : "ghost"
                                }
                                className="w-full flex items-center justify-start"
                                onClick={() => {
                                    router.push("/");
                                }}
                            >
                                <HiOutlineHome className="mr-2 h-4 w-4" />
                                Home
                            </Button>
                        </div>
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight mt-4">
                            Bookings
                        </h2>
                        <ScrollArea className=" px-3 ">
                            <Button
                                variant={
                                    pathname.startsWith("/bookings") &&
                                    pathname !== "/bookings/new" &&
                                    !pathname.startsWith("/bookings/requests")
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full flex items-center justify-start"
                                onClick={() => {
                                    router.push("/bookings");
                                }}
                            >
                                <RiBook2Line className="mr-2 h-4 w-4" />
                                Bookings
                            </Button>
                            <Button
                                variant={
                                    pathname === "/bookings/new"
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full flex items-center justify-start mt-2"
                                onClick={() => {
                                    router.push("/bookings/new");
                                }}
                            >
                                <IoIosAddCircleOutline className="mr-2 h-4 w-4" />
                                Add a Booking
                            </Button>
                            {(admin == true || authority == true) && (
                                <Button
                                    variant={
                                        pathname === "/bookings/requests" ||
                                        pathname.startsWith(
                                            "/bookings/requests"
                                        )
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="w-full flex items-center justify-start mt-2"
                                    onClick={() => {
                                        router.push("/bookings/requests");
                                    }}
                                >
                                    <VscRequestChanges className="mr-2 h-4 w-4" />
                                    Booking Requests
                                </Button>
                            )}
                        </ScrollArea>
                    </div>
                    {(admin === true || authority == true) && (
                        <>
                            <div className="py-2">
                                <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                    Venues
                                </h2>
                                <ScrollArea className=" px-3 py-2">
                                    <div className="space-y-1 px-3 ">
                                        <Button
                                            variant={
                                                pathname === "/venue"
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            className="w-full flex items-center justify-start"
                                            onClick={() => {
                                                router.push("/venue");
                                            }}
                                        >
                                            <FaRegBuilding className="mr-2 h-4 w-4" />
                                            Manage Venues
                                        </Button>
                                    </div>
                                </ScrollArea>
                            </div>
                            {admin == true && (
                                <>
                                    <div className="py-2">
                                        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                            Building
                                        </h2>
                                        <ScrollArea className=" px-3 py-2">
                                            <div className="space-y-1 px-3 ">
                                                <Button
                                                    variant={
                                                        pathname === "/building"
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className="w-full flex items-center justify-start"
                                                    onClick={() => {
                                                        router.push(
                                                            "/building"
                                                        );
                                                    }}
                                                >
                                                    <FaRegBuilding className="mr-2 h-4 w-4" />
                                                    Manage Buildings
                                                </Button>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                    <div className="py-2">
                                        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                            Users
                                        </h2>
                                        <ScrollArea className=" px-3 py-2">
                                            <div className="space-y-1 px-3 ">
                                                <Button
                                                    variant={
                                                        pathname === "/users"
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className="w-full flex items-center justify-start"
                                                    onClick={() => {
                                                        router.push("/users");
                                                    }}
                                                >
                                                    <FaUsers className="mr-2 h-4 w-4" />
                                                    Manage Users
                                                </Button>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div className="py-2">
                        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                            Profile
                        </h2>
                        <ScrollArea className=" px-3 py-2">
                            <div className="space-y-1 px-3 ">
                                <Button
                                    variant={
                                        pathname === "/profile"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="w-full flex items-center justify-start"
                                    onClick={() => {
                                        router.push("/profile");
                                    }}
                                >
                                    <CgProfile className="mr-2 h-4 w-4" />
                                    View Profile
                                </Button>
                            </div>
                        </ScrollArea>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default Sidebar;
