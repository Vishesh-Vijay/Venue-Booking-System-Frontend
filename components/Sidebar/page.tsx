"use client";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { HiOutlineHome } from "react-icons/hi2";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { RiBook2Line } from "react-icons/ri";
import { MdOutlinePostAdd } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

interface SidebarProps{
  admin:string
}
const Sidebar = ({admin}:SidebarProps) => {
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
    <div className="bg-[#598dcd] h-full text-[#fff]">
      {" "}
      <div className=" py-4">
        <div className="px-3 py-2">
          <div className="flex flex-col justify-evenly items-center gap-1 my-4">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
            <p className="font-bold text-inherit ml-2 text-xl text-white">
              <span className="text-[#313465] mr-1">Venue</span>
              Booker
            </p>
          </div>
          <h2 className=" px-4 text-lg font-semibold mt-12 ">Explore</h2>
          <div className="space-y-1 px-3 mt-2">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {
                router.push("/");
              }}
            >
              <HiOutlineHome className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          {/* <div className="space-y-1 px-3">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {
                router.push("/");
              }}
            >
              <HiOutlineHome className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant={pathname === "/bookings" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {router.push("/bookings")}}
            >
              <RiBook2Line className="mr-2 h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant={pathname === "/requests" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {
                router.push("/requests");
              }}
            >
              <MdOutlineWorkspacePremium className="mr-2 h-4 w-4" />
              Atlantis Prime
            </Button>
          </div> */}
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Bookings
          </h2>
          <ScrollArea className=" px-3 ">
            <Button
              variant={pathname === "/bookings" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {
                router.push("/bookings");
              }}
            >
              <RiBook2Line className="mr-2 h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant={pathname === "/bookings/new" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start mt-2"
              onClick={() => {
                router.push("/bookings/new");
              }}
            >
              <MdOutlinePostAdd className="mr-2 h-4 w-4" />
              Add a Booking
            </Button>
            {admin=="admin" && <Button
              variant={pathname === "/bookings/requests" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start mt-2"
              onClick={() => {
                router.push("/bookings/requests");
              }}
            >
              <MdOutlinePostAdd className="mr-2 h-4 w-4" />
              Booking Requests
            </Button>}
          </ScrollArea>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Profile
          </h2>
          <ScrollArea className=" px-3 py-2">
            <div className="space-y-1 px-3 ">
              <Button
                variant={pathname === "/profile" ? "secondary" : "ghost"}
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
      </div>
    </div>
  );
};

export default Sidebar;
