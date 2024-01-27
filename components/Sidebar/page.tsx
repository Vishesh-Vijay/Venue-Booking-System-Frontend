"use client";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { HiOutlineHome } from "react-icons/hi2";
import { CiStreamOn } from "react-icons/ci";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { CgGames } from "react-icons/cg";
import { CiMicrophoneOn } from "react-icons/ci";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { IoTrophyOutline } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { GrChannel } from "react-icons/gr";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { RiBook2Line } from "react-icons/ri";
import { MdOutlinePostAdd } from "react-icons/md";

const Sidebar = () => {
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
          <div className="space-y-1 px-3 mt-12">
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
          <ScrollArea className="space-y-1 h-28 px-3">
            <Button
              variant={pathname === "/bookings" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {router.push("/bookings")}}
            >
              <RiBook2Line className="mr-2 h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant={pathname === "/bookings/new" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {router.push("/bookings/new")}}
            >
              <MdOutlinePostAdd className="mr-2 h-4 w-4" />
              Add a Booking
            </Button>
            <Button
              variant={pathname === "/categories/music" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {}}
            >
              <HiOutlineMusicalNote className="mr-2 h-4 w-4" />
              Music
            </Button>
            <Button
              variant={pathname === "Esports" ? "secondary" : "ghost"}
              className="w-full flex items-center justify-start"
              onClick={() => {}}
            >
              <IoTrophyOutline className="mr-2 h-4 w-4" />
              Esports
            </Button>
            <Button
              variant={
                pathname === "/categories/creative" ? "secondary" : "ghost"
              }
              className="w-full flex items-center justify-start"
              onClick={() => {}}
            >
              <HiOutlinePaintBrush className="mr-2 h-4 w-4" />
              Creative
            </Button>
          </ScrollArea>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Your Channels
          </h2>
          <ScrollArea className=" px-3 h-32">
            <div className="space-y-1 p-2 ">
              {channels?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant={
                    pathname === `/yourchannels/${playlist}`
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full flex items-center justify-start font-normal"
                  onClick={() => {}}
                >
                  <GrChannel className="mr-2 h-4 w-4" />
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
