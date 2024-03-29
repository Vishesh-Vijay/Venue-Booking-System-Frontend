"use client";
import React, { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createBooking,
  getAllVenues,
  getAllBuildings,
  getVenueByBuilding,
} from "@/utils/utils";
import { toast } from "sonner";

interface Venue {
  authority_id: string; //email
  building_id: string; //id
  floor_number: Number;
  has_air_conditioner: Boolean;
  has_projectors: Boolean;
  has_speakers: Boolean;
  has_whiteboard: Boolean;
  id: string; //id
  is_accessible: Boolean;
  name: string;
  seating_capacity: Number;
  venue_type: string;
}

interface Building {
  id: string;
  name: string;
}

const AddNewBooking = () => {
  const [date, setDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("00:00");
  const [expectedStrength, setExpectedStrength] = React.useState("");
  const [bookingType, setBookingType] = React.useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [duration, setDuration] = useState("0");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venues, setVenues] = useState<Array<Venue>>([]);
  const [buildings, setBuildings] = useState<Array<Building>>([]);
  const [building, setBuilding] = useState("");
  const [buildingSelected, setBuildingSelected] = useState(false);
  const [availableVenues, setAvailableVenues] = useState<Array<Venue>>([]);
  const [timeSelected, setTimeSelected] = useState(false);

  useEffect(() => {
    const getBuildings = async () => {
      try {
        const token = localStorage.getItem("token");
        const userDetails: any = await getAllBuildings(token as string).then(
          (res) => {
            const resp: any = res;
            if (resp.status === 200) {
              const data = resp.data.response_data;
              setBuildings(data);
            }
          }
        );
      } catch (error: any) {
        console.log(error);
      }
    };
    getBuildings();
  }, []);

  const handleBuildingSelect = async (building: string) => {
    setBuildingSelected(true);
    const buildId = buildings.find((build) => build.name === building)?.id;
    setBuilding(buildId as string);
    try {
      const token = localStorage.getItem("token");
      const response = await getVenueByBuilding(
        buildId as string,
        token as string
      ).then((res: any) => {
        const resp = res;
        if (resp.status === 200) {
          const data = resp.data.response_data;
          setVenues(data);
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const filterAvailableVenues = () => {
    // Here you can implement the logic to filter the available venues based on the selected date, time, and duration
    // For example, you can make an API call to get the available venues and set them to the `availableVenues` state
    setAvailableVenues(venues);
  };

  const handleSubmit: any = async () => {
    if (
      date &&
      startTime &&
      selectedVenue &&
      title &&
      description &&
      bookingType &&
      duration &&
      expectedStrength
    ) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const [hours, minutes] = startTime.split(":").map(Number);
      const combinedDateTime = new Date(
        Date.UTC(year, month - 1, day, hours, minutes)
      );
      const formattedDateTime = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      }).format(combinedDateTime);

      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user") as string;
        const venueId:string = venues.find((venu) => venu.name === selectedVenue)?.id as string;
        const response = await createBooking(
          {
            title,
            description,
            user_id: user,
            venue_id: venueId,
            booking_type: bookingType.toUpperCase(),
            event_time: combinedDateTime,
            event_duration: parseInt(duration, 10),
            expected_strength: parseInt(expectedStrength, 10),
          },
          token as string
        ).then((res: any) => {
          const resp = res;
          if (resp.status === 200) {
            if (
              resp.data.response_data.booking_status ===
              "AUTOMATICALLY_DECLINED"
            ) {
              toast(
                "Booking Declined Automatically due to conflicting time with another event!",
                {
                  style: {
                    backgroundColor: "#eb575a",
                  },
                }
              );
            } else {
              toast(
                "Booking Created Successfully! Check Bookings Tab for further updates",
                {
                  style: {
                    backgroundColor: "#00fa9a",
                  },
                }
              );
              resetForm();
            }
          }
        });
      } catch (error: any) {
        toast(
          `${error.response?.data?.response_message || "An error occurred"}`,
          {
            style: {
              backgroundColor: "red",
            },
          }
        );
      }
    } else {
      toast("Please fill all required fields", {
        style: {
          backgroundColor: "red",
        },
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedVenue("");
    setStartTime("00:00");
    setDuration("0");
    setDate(new Date());
    setExpectedStrength("");
    setBookingType("");
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-semibold text-4xl mt-3">
        Create New Booking
      </h1>
      <div className="flex flex-col justify-center items-center w-full">
        {!buildingSelected && (
          <>
            <h1 className="w-full text-center text-2xl mt-8">
              Select Building
            </h1>
            <div className="w-48 flex justify-center items-center h-24 ">
              <Label className="mr-2">Building</Label>
              <Select value={building} onValueChange={handleBuildingSelect}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.length > 0 ? (
                    buildings.map((building, index) => (
                      <div key={index}>
                        <SelectItem value={building.name}>
                          {building.name}
                        </SelectItem>
                      </div>
                    ))
                  ) : (
                    <p>No buildings to select! Create one first</p>
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {buildingSelected && !timeSelected && (
          <>
            <h1 className="w-full text-center text-2xl mt-8">
              Select Date, Time, and Duration
            </h1>
            <div className="grid grid-cols-3 gap-y-12 gap-x-12 w-full p-5 mt-6">
              <div className="w-full h-full">
                <Label>Event Date</Label>
                <br />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-2/3 justify-start text-left font-normal"
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
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setStartTime(e.target.value)}
                  value={startTime}
                  className="w-2/3"
                />
              </div>
              <div className="w-full h-full">
                <Label>Event Duration</Label>
                <Input
                  name="Duration"
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}
                  className="w-2/3"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                setTimeSelected(true);
                filterAvailableVenues();
              }}
            >
              Next
            </Button>
          </>
        )}

        {buildingSelected && timeSelected && !selectedVenue && (
          <>
            <h1 className="w-full text-center text-2xl mt-8">Select Venue</h1>
            <div className="w-48 flex justify-center items-center h-48 ">
              <Label className="mr-2">Venue</Label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select Venue" />
                </SelectTrigger>
                <SelectContent>
                  {availableVenues.map((venue, index) => (
                    <div key={index}>
                      <SelectItem value={venue.name}>{venue.name}</SelectItem>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedVenue && (
          <>
            <div className="grid grid-cols-2 gap-y-12 gap-x-12 w-full p-5 mt-6">
              <div className="w-full h-full">
                <Label>Title</Label>
                <Input
                  name="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="w-2/3"
                />
              </div>
              <div className="w-full h-full">
                <Label htmlFor="message">Description</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  className="w-2/3"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="w-full h-full">
                <Label>Booking Type</Label>
                <Select value={bookingType} onValueChange={setBookingType}>
                  <SelectTrigger className="w-2/3">
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
                <Label>Venue</Label>
                <Input
                  name="Venue"
                  value={selectedVenue}
                  className="w-2/3"
                  disabled
                />
              </div>
              <div className="w-full h-full">
                <Label>Expected Strength</Label>
                <Input
                  type="textbox"
                  name="expectedStrength"
                  placeholder="Expected Strength"
                  onChange={(e) => setExpectedStrength(e.target.value)}
                  value={expectedStrength}
                  className="w-2/3"
                />
              </div>
            </div>
            <div className="text-center mt-6 flex justify-center items-center gap-x-4">
              <Button onClick={handleSubmit}>Submit</Button>
              <Button onClick={resetForm}>Reset</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewBooking;
