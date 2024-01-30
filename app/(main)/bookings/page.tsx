"use client";
import React, { useState, ChangeEvent } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
      <div className="flex justify-around items-center mt-6">
        <ToggleButtonGroup
          value={bookingType}
          exclusive
          onChange={handleChangeBookingType}
          aria-label="text formatting"
        >
          <ToggleButton
            value="upcoming"
            aria-label="bold"
            color={bookingType === "upcoming" ? "primary" : "standard"}
          >
            <span className={bookingType === "upcoming" ? "font-semibold" : ""}>
              Upcoming
            </span>
          </ToggleButton>
          <ToggleButton
            value="past"
            aria-label="italic"
            color={bookingType === "past" ? "primary" : "standard"}
          >
            <span className={bookingType === "past" ? "font-semibold" : ""}>
              Past
            </span>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        {bookingType === "upcoming" ? (
          <div>
            {upcomingEvents.map((event, index) => (
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
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {pastEvents.map((event, index) => (
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
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;