"use client";
import React, { useState, ChangeEvent,useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
interface Event {
  booking_status: string;
  booking_time: string;
  booking_type: string;
  description: string;
  event_duration: Number;
  event_time: string;
  expected_strength: Number;
  id: string;
  last_updated_time: string;
  title: string;
  user_id:string;
  venue_id: string;
}
import BookingCard from "@/components/BookingCard/page";
import { getAllBookings } from "@/utils/utils";

const Bookings: React.FC = () => {

  const today = new Date();

  const [bookingData,setBookingData] = useState<Array<Event>>([])
  const [resetBookings,setResetBookings] = useState(false)
  useEffect(()=>{
    const getBookings = async()=>{
      try {
        const user_id = localStorage.getItem("user")
        const token = localStorage.getItem("token")
        const response = await getAllBookings(user_id as string,token as string).then((res:any)=>{
          const resp=res;
          if(resp.status==200){
            const data = resp.data.response_data
            setBookingData(data)
          }
        })
      } catch (error:any) {
        console.log(error) 
      }
    }
    getBookings()
  },[resetBookings]) 
  const upcomingEvents: Event[] = bookingData.filter(
    (event) => new Date(event.event_time) > today
  );

  const pastEvents: Event[] = bookingData.filter(
    (event) => new Date(event.event_time) <= today
  );

  return (
    <div className="p-4">
      <h1 className="text-center font-semibold text-4xl mt-3">My Bookings</h1>
      <div className="flex justify-around items-center mt-8">
        <Tabs
          defaultValue="upcoming"
          className="w-full flex flex-col justify-around items-center "
        >
          <TabsList className="grid  grid-cols-2 w-1/2 bg-[#313465] px-2 py-1 text-white">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="w-full">
            <ScrollArea className="h-[520px]">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="mt-2 flex flex-col justify-center items-center"
                  >
                    <BookingCard
                      name={event.title}
                      type={event.booking_type}
                      location={event.venue_id}
                      date={event.event_time}
                      id={event.id}
                      approval={event.booking_status}
                      Btype="upcoming"
                      setResetBookings={() => setResetBookings((val) => !val)}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full mt-12 text-center font-bold text-2xl">
                  No bookings found!!
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="past" className="w-full">
            <div>
              {pastEvents.length > 0 ? (
                pastEvents.map((event, index) => (
                  <div
                    key={index}
                    className="mt-2 flex flex-col justify-center items-center"
                  >
                    <BookingCard
                      id={event.id}
                      name={event.title}
                      type={event.booking_type}
                      location={event.venue_id}
                      date={event.event_time}
                      approval={event.booking_status}
                      Btype="past"
                      setResetBookings={() => setResetBookings((val) => !val)}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full mt-12 text-center font-bold text-2xl">
                  No bookings found!!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookings;