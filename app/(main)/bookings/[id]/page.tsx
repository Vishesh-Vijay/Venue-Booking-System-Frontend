'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
import { getBookingDetails } from '@/utils/utils';
import { Badge } from "@/components/ui/badge";
import { IoCalendarOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";
import { GiDuration } from "react-icons/gi";

interface BookingDetailsProps {
  booking_status?:string;
  booking_time?: string;
  booking_type?: string;
  description?: string;
  event_duration?: Number;
  event_time?: string;
  expected_strength?: Number;
  id?: string;
  last_updated_time?: string;
  title?:string;
  user_id?: string;
  venue_id?: string
}
const BookingDetails = ({params}:{params:{id:string}}) => {
    const router = useRouter()
    const [bookingDetails,setBookingDetails] = useState<BookingDetailsProps>()
    useEffect(()=>{
        const getBookingDetailsById = async()=>{
            const token=localStorage.getItem("token")
            const response = await getBookingDetails(params.id,token as string).then((res:any)=>{
              const resp=res;
              if(resp.status == 200){
                const data=resp.data.response_data
                console.log(data);
                setBookingDetails(data) 
              }
            })
        }
        getBookingDetailsById()
    },[params.id])
    function convertISOToUTC(isoTimeString:Date) {
      const date = new Date(isoTimeString);

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1; // Adding 1 because getUTCMonth() returns zero-based month index
      const day = date.getUTCDate();

      const hours =
        date.getMinutes() >= 30 ? date.getHours() - 5 : date.getHours() - 6;
      const minutes =
        date.getMinutes() >= 30
          ? date.getMinutes() - 30
          : 30 + date.getMinutes();
      // const seconds = date.getUTCSeconds();

      return {
        date: year + "-" + month + "-" + day,
        time:  hours+":"+ (minutes<10?"0"+minutes:minutes) 
      };
    }
    const date = new Date(bookingDetails?.event_time as string)
    const dateString = convertISOToUTC(date).date
    const timeString = convertISOToUTC(date).time
    const bookingDate = new Date(bookingDetails?.booking_time as string)
    const bookingDateString = convertISOToUTC(bookingDate)
    const lastUpdatedDate = new Date(bookingDetails?.last_updated_time  as string)
    const lastUpdatedDateString = convertISOToUTC(lastUpdatedDate) 
  return (
    <div className="p-4">
      {bookingDetails && (
        <>
          <div className="flex w-full justify-between items-center mt-4">
            <h1 className="w-5/6 text-center font-semibold text-4xl">
              Booking Details
            </h1>
            <div className="w-1/6 flex justify-center items-end">
              <Button
                variant="default"
                className="bg-[#313465] text-white flex items-center justify-between"
                onClick={() => {
                  router.push("/bookings");
                }}
              >
                <IoArrowBack className="w-4 h-4 mr-1 mt-0.5" />
                <span>Back</span>
              </Button>
            </div>
          </div>
          <div className="mx-24 my-16">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-semibold">{bookingDetails.title}</h1>
              <Badge
                variant="outline"
                className={
                  bookingDetails.booking_status == "PENDING"
                    ? "border-blue-400 text-blue-400 px-4 py-2 border-2 font-bold mt-2"
                    : bookingDetails.booking_status == "CANCELLED"
                    ? "border-yellow-400 text-yellow-400 px-4 py-2 border-2 font-bold mt-2"
                    : bookingDetails.booking_status == "REJECTED"
                    ? "border-red-400 text-red-400 px-4 py-2 border-2 font-bold mt-2"
                    : "border-green-400 text-green-400 px-4 py-2 border-2 font-bold mt-2"
                }
              >
                {bookingDetails.booking_status}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex justify-left items-center">
                <IoCalendarOutline className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-400">{dateString}</span>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <div className="flex items-center justify-center">
                  <CiTimer className="w-4 h-4 text-gray-400 mr-1 mt-0.5" />
                  <span className="text-gray-400">{timeString} hrs</span>
                </div>

                <div className="flex items-center justify-center">
                  <GiDuration className="w-4 h-4 text-gray-400 mr-1 mt-0.5" />
                  <span className="text-gray-400">
                    {String(bookingDetails.event_duration)} hrs
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-start space-y-4">
              <h1>{bookingDetails.description}</h1>
              <h1>
                {" "}
                <span className="font-semibold">Expected Strength:</span>{" "}
                {String(bookingDetails.expected_strength)}
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Booking Time:</span>{" "}
                {bookingDateString.date +
                  " at " +
                  bookingDateString.time +
                  " hrs"}
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Last Updated Time:</span>{" "}
                {lastUpdatedDateString.date +
                  " at " +
                  lastUpdatedDateString.time +
                  " hrs"}
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingDetails
