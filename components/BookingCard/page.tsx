"use client"
import React, { useEffect,useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface BookingCardProps {
  id:string
  name: string;
  type: string;
  location: string;
  date: string;
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
import { getVenueDetailsById } from "@/utils/utils";
import { useRouter } from "next/navigation";
const BookingCard = (props: BookingCardProps) => {
  const inputDate = new Date(props.date);
  const router = useRouter()
  // Months and their respective names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month, day, year, hours, and minutes from the parsed date
  const monthIndex = inputDate.getMonth();
  const day = inputDate.getDate();
  const year = inputDate.getFullYear();
  let hours = inputDate.getMinutes()>=30?inputDate.getHours()-5:inputDate.getHours()-6;
  const minutes = inputDate.getMinutes()>=30?inputDate.getMinutes()-30:inputDate.getMinutes()+30;

  // Convert hours to 12-hour format and determine AM/PM
  const amPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  // Format the date and time
  const formattedDateTime = `${months[monthIndex]} ${day}${getDaySuffix(
    day
  )}, ${year} at ${hours}:${(minutes).toString().padStart(2, "0")} ${amPm}`;

  // Function to get the day suffix (e.g., 1st, 2nd, 3rd, etc.)
  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const [venue,setVenue] = useState("")
  useEffect(()=>{
    const getVenueById=async()=>{
      try {
        const token = localStorage.getItem("token")
        const response = await getVenueDetailsById(props.location,token as string).then((res:any)=>{
          const resp=res
          if(resp.status==200){
            const data=resp.data.response_data;
            setVenue(data.name)
          }
          ;
        })
      } catch (error:any) {
       console.log(error) 
      } 
    }
    getVenueById()
  },[props.location])
  const handleViewDetails = () =>{
    router.push(`/bookings/${props.id}`)
  }
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
            {venue}
          </p>
          <p className="flex items-center mt-2">
            <MdOutlineTimer className="mr-1" />
            {formattedDateTime}
          </p>
        </CardContent>
      </div>
      <div className="flex flex-col justify-between items-end h-36 mt-5 mr-5">
        <CardFooter
          className={
            props.approval == "APPROVED"
              ? "text-[#53AB68]  bg-white p-3 rounded-2xl font-bold"
              : props.approval == "REJECTED"
              ? "text-[#EB575A]  bg-white p-3 rounded-2xl font-bold"
              : props.approval == "CANCELLED"
              ? "text-[#E6B664] bg-white p-3 rounded-2xl font-bold"
              : "text-[#5DB4F7]  bg-white p-3 rounded-2xl font-bold"
          }
        >
          {props.approval[0].toUpperCase() +
            props.approval.slice(1, props.approval.length)}
        </CardFooter>
        <div className="flex justify-between items-center">
          <Button variant="default" className="mr-2 bg-green-600" onClick={()=>handleViewDetails()}>
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
