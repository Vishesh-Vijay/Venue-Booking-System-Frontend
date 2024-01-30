"use client";
import React, { useState, ChangeEvent } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface Event {
  name: string;
  type: string;
  location: string;
  time: string;
  date: Date;
  approval: string;
}

import BookingCard from "@/components/BookingCard/page";
const Bookings: React.FC = () => {
  const [bookingType, setBookingType] = useState<string>("upcoming");

  const handleChangeBookingType = (
    event: ChangeEvent<{}>,
    newBookingType: string
  ) => {
    if (newBookingType != null) {
      setBookingType(newBookingType);
    }
  };
  const today = new Date();

  const bookingData: Event[] = [
    {
      name: "Seminar on Machine Learning",
      type: "seminar",
      location: "Conference Hall",
      time: "10:00 am",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      ),
      approval: "approved",
    },
    {
      name: "Conference Meet",
      type: "academic",
      location: "CC-3, IIITA",
      time: "12:30 pm",
      date: today,
      approval: "approved",
    },
    {
      name: "Workshop on React Development",
      type: "workshop",
      location: "Room 102",
      time: "2:00 pm",
      date: today,
      approval: "received",
    },
    {
      name: "Hackathon Finals",
      type: "competition",
      location: "Coding Lab",
      time: "1:30 pm",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7
      ),
      approval: "rejected",
    },
    {
      name: "Project Presentation",
      type: "academic",
      location: "Auditorium",
      time: "3:45 pm",
      date: today,
      approval: "cancelled",
    },
    {
      name: "Project Demo Day",
      type: "academic",
      location: "Room 205",
      time: "4:15 pm",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 21
      ),
      approval: "received",
    },
  ];
  const upcomingEvents: Event[] = bookingData.filter(
    (event) => event.date > today
  );

  const pastEvents: Event[] = bookingData.filter(
    (event) => event.date <= today
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
            <div>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="mt-2 flex flex-col justify-center items-center"
                  >
                    <BookingCard
                      name={event.name}
                      type={event.type}
                      location={event.location}
                      date={event.date}
                      time={event.time}
                      approval={event.approval}
                      Btype="upcoming"
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
          <TabsContent value="past" className="w-full">
            <div>
              {pastEvents.length > 0 ? (
                pastEvents.map((event, index) => (
                  <div
                    key={index}
                    className="mt-2 flex flex-col justify-center items-center"
                  >
                    <BookingCard
                      name={event.name}
                      type={event.type}
                      location={event.location}
                      date={event.date}
                      time={event.time}
                      approval={event.approval}
                      Btype="past"
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