"use client";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface BookingCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  date: string;
  approval: string;
  Btype: string;
  setResetBookings:()=>void;
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
import { cancelBooking, getVenueDetailsById } from "@/utils/utils";
import { useRouter } from "next/navigation";
const BookingCard = (props: BookingCardProps) => {
  // props.approval == "PENDING"? props.approval="Received":props.approval="PENDING"
  const inputDate = new Date(props.date);
  const router = useRouter();
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
  const monthIndex = parseInt(moment(inputDate).utc().format("MM")) ;
  const day = parseInt(moment(inputDate).utc().format("DD")) ;
  const year = parseInt(moment(inputDate).utc().format("YYYY")) ;
  let hours =  parseInt(moment(inputDate).utc().format("HH")) ;
  const minutes =  parseInt(moment(inputDate).utc().format("mm")) ;

  // Convert hours to 12-hour format and determine AM/PM
  const amPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  // Format the date and time
  const formattedDateTime = `${months[monthIndex-1]} ${day}${getDaySuffix(
    day
  )}, ${year} at ${hours}:${minutes.toString().padStart(2, "0")} ${amPm}`;

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
  const [venue, setVenue] = useState("");
  useEffect(() => {
    const getVenueById = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getVenueDetailsById(
          props.location,
          token as string
        ).then((res: any) => {
          const resp = res;
          if (resp.status == 200) {
            const data = resp.data.response_data;
            setVenue(data.name);
          }
        });
      } catch (error: any) {
        console.log(error);
      }
    };
    getVenueById();
  }, [props.location]);
  const handleViewDetails = () => {
    router.push(`/bookings/${props.id}`);
  };

  const handleCancelBooking = async() =>{
    try{
      const token = localStorage.getItem("token")
      const response = await cancelBooking(props.id as string,token as string).then((res:any)=>{
        const resp=res;
        if(resp.status==200){
          props.setResetBookings()
          toast("Booking has been successfully cancelled!", {
            style: {
              backgroundColor: "#00fa9a",
            },
          });
        }
      })
    } 
    catch(error:any){
      // console.log(error.response.response_data.message)
      toast(`${error.response?.data?.response_message || "An error occured"}`, {
        style: {
          backgroundColor: "red",
        },
      });
    }
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
          {props.approval == "PENDING"
            ? "Received"
            : props.approval[0].toUpperCase() +
              props.approval.slice(1, props.approval.length).toLowerCase()}
        </CardFooter>
        <div className="flex justify-between items-center">
          <Button
            variant="default"
            className="mr-2 bg-green-600"
            onClick={() => handleViewDetails()}
          >
            View Details
          </Button>
          {props.Btype == "upcoming" &&
            (props.approval == "APPROVED" || props.approval == "PENDING") && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive" className="">
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently cancel
                      your booking request.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>handleCancelBooking()}>Yes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
