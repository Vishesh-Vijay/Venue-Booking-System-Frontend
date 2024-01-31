"use client";
import React from "react";
import Image from "next/image";
import { IoCalendarOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isPast } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimePicker from "react-time-picker";
import Alert from "@mui/material/Alert";

const AddNewBooking = () => {
  const [date, setDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("00:00");
  const [endTime, setEndTime] = React.useState("00:00");
  const [expectedStrength, setExpectedStrength] = React.useState("");
  const [bookingType, setBookingType] = React.useState("");
  const [venueType, setVenueType] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState("");
  const currentDate = new Date();

  const isDateValid = date && !isPast(date);
  const isStartTimeValid = startTime >= currentDate.toISOString().slice(11, 16);
  const isEndTimeValid = endTime > startTime;
    console.log(
      date,
      startTime,
      endTime,
      bookingType,
      venueType,
      expectedStrength
    );

  const handleSubmit = () => {
    // Validation logic
    if (!isDateValid) {
      setShowAlert(true);
      setIsError(true);
      if(date==null)
      setError("Please fill the date");
      else setError("You cannot book venues for past")
      setTimeout(() => {
        setShowAlert(false);
        setIsError(false);
        setError("");
      }, 1500);
      console.error("Invalid date");
      return;
    }

    if (!isStartTimeValid) {
      // Display error for start time
      setShowAlert(true);
      setIsError(true);
      setError("The start time is invalid");
      setTimeout(() => {
        setShowAlert(false);
        setIsError(false);
        setError("");
      }, 1500);
      console.error("Invalid start time");
      return;
    }

    if (!isEndTimeValid) {
      // Display error for end time
      setShowAlert(true);
      setIsError(true);
      setError("The end time is invalid");
      setTimeout(() => {
        setShowAlert(false);
        setIsError(false);
        setError("");
      }, 1500);
      console.error("Invalid end time");
      return;
    }

    // Other validations...
    if (bookingType == "" || venueType == "" || expectedStrength == "") {
      setShowAlert(true);
      setIsError(true);
      setError("Please fill all the fields");
      setTimeout(() => {
        setShowAlert(false);
        setIsError(false);
        setError("");
      }, 1500);
    }
    // Proceed with submission if all validations pass
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false); 
      setDate(undefined)
      setStartTime("00:00")
      setEndTime("00:00")
      setVenueType("")
      setBookingType("")
      setExpectedStrength("")
    }, 2500);
    
    console.log("Form submitted");
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-semibold text-4xl mt-3">
        Create New Booking
      </h1>
      <div className="grid grid-cols-2 gap-y-24 gap-x-12  p-5 mt-6">
        <div className="w-full h-full">
          <Label>Date</Label>
          <br />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !isDateValid && "text-muted-foreground"
                )}
              >
                <IoCalendarOutline className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full h-full">
          <Label>Start Time (24 HR format)</Label>
          <Input
            type="time"
            name="StartTime"
            onChange={(e) => setStartTime(e.target.value)}
            value={startTime}
          />
        </div>

        <div className="w-full h-full">
          <Label>Booking Type</Label>
          <Select value={bookingType} onValueChange={setBookingType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Booking Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full h-full">
          <Label>End Time (24 HR format)</Label>
          <Input
            type="time"
            name="endTime"
            onChange={(e) => setEndTime(e.target.value)}
            value={endTime}
          />
        </div>
        <div className="w-full h-full">
          <Label>Venue Type</Label>
          <Select value={venueType} onValueChange={setVenueType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Venue Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="meeting_room">Meeting Room</SelectItem>
              <SelectItem value="auditorium">Auditorium</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full h-full">
          <Label>Expected Strength</Label>
          <Input
            type="textbox"
            name="expectedStrength"
            placeholder="Expected Strength"
            onChange={(e) => setExpectedStrength(e.target.value)}
            value={expectedStrength}
          />
        </div>
      </div>
      <div className="text-center mt-6">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      {showAlert && !isError && (
        <Alert severity="success" className="mt-4 absolute right-1 top-8">
          Form submitted
        </Alert>
      )}
      {isError && (
        <Alert severity="error" className="absolute right-1 top-8">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default AddNewBooking;
