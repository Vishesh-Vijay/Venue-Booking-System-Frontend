'use client'
import React,{useEffect, useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBookingRequestsByUser } from '@/utils/utils';
interface BookingRequestProps {
  booking_id: string;
  id: string;
  last_updated_time: string;
  receiver_id: string;
  request_status: string;
}
const BookingRequests = () => {
  const [bookingRequests,setBookingRequests] = useState<Array<BookingRequestProps>>()
  useEffect(()=>{
    const getBookingRequests = async()=>{
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")
      const response = await getBookingRequestsByUser(user as string,token as string).then((res:any)=>{
        const resp=res;
        if(resp.status==200){
          const data = resp.data.response_data
          setBookingRequests(data)
        }
      })
    }
    getBookingRequests();
  },[])
  const pendingRequests = bookingRequests?.filter((request)=>request.request_status == "RECEIVED")
  const resolvedRequests = bookingRequests?.filter((request)=>request.request_status !== "RECEIVED")
  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold text-center mt-6">
        Booking Requests
      </h1>
      <div className="flex justify-around items-center mt-8">
        <Tabs
          defaultValue="pending"
          className="w-full flex flex-col justify-around items-center "
        >
          <TabsList className="grid  grid-cols-2 w-1/2 bg-[#313465] px-2 py-1 text-white">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
        </Tabs>
      </div>
    </div>
  );
}

export default BookingRequests