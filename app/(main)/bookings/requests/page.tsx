'use client'
import React,{useEffect, useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBookingRequestsByUser } from '@/utils/utils';
import BookingRequestCard from '@/components/BookingRequestCard/page';
import { ScrollArea } from '@/components/ui/scroll-area';
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
          console.log(data)
          setBookingRequests(data)
        }
      })
    }
    getBookingRequests();
  },[])
  const pendingRequests = bookingRequests?.filter((request)=>request.request_status !== "APPROVED")
  const resolvedRequests = bookingRequests?.filter((request)=>request.request_status === "APPROVED")
  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold text-center mt-6">
        Booking Requests
      </h1>
      <div className="flex justify-around items-center mt-8 w-full">
        <Tabs
          defaultValue="pending"
          className="w-full flex flex-col justify-around items-center "
        >
          <TabsList className="grid  grid-cols-2 w-1/2 bg-[#313465] px-2 py-1 text-white">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="w-full">
            <ScrollArea className="h-[550px]">
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div key={request.id} className="mt-4 px-20 w-full">
                    <BookingRequestCard
                      BookingId={request.booking_id}
                      // status={request.request_status}
                      request_id={request.id}
                    />
                  </div>
                ))
              ) : (
                <p className="mt-4 w-full text-center">No pending requests</p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="resolved" className="w-full">
            <ScrollArea className='h-[550px]'>
              {resolvedRequests && resolvedRequests.length > 0 ? (
                resolvedRequests.map((request) => (
                  <div key={request.id} className="mt-4 px-20 w-full">
                    <BookingRequestCard
                      BookingId={request.booking_id}
                      request_id={request.id}
                      // status={request.request_status}
                    />
                  </div>
                ))
              ) : (
                <p className="mt-4 w-full text-center">No resolved requests</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default BookingRequests