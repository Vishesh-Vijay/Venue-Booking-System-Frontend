import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface BookingCardProps {
  name: string;
  type: string;
  location: string;
  time: string;
  date: Date;
  approval: string;
  Btype:string
}
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CiMenuKebab } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";

import { Button } from "../ui/button";
const BookingCard = (props: BookingCardProps) => {
  return (
    <Card className="bg-[#313465] text-white w-11/12 rounded-2xl flex justify-between items-start">
      <div>
        <CardHeader>
          <CardTitle>{props.name}</CardTitle>
          <CardDescription className="font-semibold">
            {props.type}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex items-center">
            <IoLocationOutline className="mr-1" />
            {props.location}
          </p>
          <p className="flex items-center mt-2">
            <MdOutlineTimer className="mr-1" />
            {props.date.toDateString()} at {props.time}
          </p>
        </CardContent>
      </div>
      <div className="flex flex-col justify-between items-end h-36 mt-5 mr-5">
        <CardFooter
          className={
            props.approval == "approved"
              ? "text-[#53AB68]  bg-white p-3 rounded-2xl font-bold"
              : props.approval == "rejected"
              ? "text-[#EB575A]  bg-white p-3 rounded-2xl font-bold"
              : props.approval == "cancelled"
              ? "text-[#E6B664] bg-white p-3 rounded-2xl font-bold"
              : "text-[#5DB4F7]  bg-white p-3 rounded-2xl font-bold"
          }
        >
          {props.approval[0].toUpperCase() +
            props.approval.slice(1, props.approval.length)}
        </CardFooter>
        <div className="flex justify-between items-center">
          <Button variant="default" className="mr-2 bg-green-600">
            View Details
          </Button>
          {props.Btype == "upcoming" && (
            <Button variant="destructive" className="">
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
