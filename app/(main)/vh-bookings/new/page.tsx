/* eslint-disable react/jsx-no-undef */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CircularProgress } from "@mui/material";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Checkbox from "@mui/material/Checkbox";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { createVHBooking } from "@/utils/utils";

interface VHBooking {
    user_id: string;
    user_address: string;
    user_contact: string;
    arrival_time: string;
    departure_time: string;
    rooms_required: number;
    booking_purpose: string;
    booking_type: string;
    requestby: string;
    id_proof: string;
}

const VHBookingForm = () => {
    //   const [email, setEmail] = useState("")
    //   const [name, setName] = useState("")
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(null);
    const [arrivalTime, setArrivalTime] = useState<Dayjs | null>(null);
    const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
    const [departureTime, setDepartureTime] = useState<Dayjs | null>(null);
    const [accomodation, setAccomodation] = useState("");
    const [rooms, setRooms] = useState("");
    const [requestBy, setRequestBy] = useState("");
    const [bookingType, setBookingType] = useState("");
    const [bookingPurpose, setBookingPurpose] = useState("");
    const [idProof, setIdProof] = useState("");
    const [disclaimer, setDisclaimer] = useState(false);
    const [idPicture, setIdPicture] = useState<File | null>(null);

    const handleDisclaimerChange = () => {
        setDisclaimer(!disclaimer);
    };

    const handleCreateBooking = async () => {
        if (!disclaimer) {
            toast("Accept the disclaimer to make your booking", {
                style: {
                    backgroundColor: "red",
                    color: "white",
                },
            });
            return;
        }

        if (!arrivalDate || !arrivalTime || !departureDate || !departureTime) {
            toast("Arrival and departure date and time fields are mandatory", {
                style: {
                    backgroundColor: "red",
                    color: "white",
                },
            });
            return;
        }

        let hours = arrivalTime.hour();
        let minutes = arrivalTime.minute();

        const arrivalDateTime = arrivalDate.hour(hours).minute(minutes);
        const arrivalIsoString = arrivalDateTime.toISOString();

        hours = departureTime.hour();
        minutes = departureTime.minute();

        const departureDateTime = departureDate.hour(hours).minute(minutes);
        const departureIsoString = departureDateTime.toISOString();

        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user") as string;
        const roomsNumber = parseInt(rooms);

        const obj = {
            user_id: user,
            user_address: address,
            user_contact: contactNumber,
            arrival_time: arrivalIsoString,
            departure_time: departureIsoString,
            rooms_required: roomsNumber,
            booking_purpose: bookingPurpose,
            booking_type: bookingType.toUpperCase(),
            requestby: requestBy.toUpperCase(),
            id_proof: idPicture,
        };

        try {
            const response = await createVHBooking(obj, token as string).then(
                (res: any) => {
                    const resp = res;
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
                    }
                }
            );
        } catch (error: any) {
            // setIsError(true);
            // setError(error.response.data.response_message);
            // setTimeout(() => {
            //     setIsError(false);
            //     setError("");
            // }, 3000);
        } finally {
            // setLoading(false);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setIdPicture(file);
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="ml-5 mt-3 items-center w-4/5 space-y-2 mb-10">
                    <div className="mx-5 mb-5 font-sans sm:font-sans font-medium">
                        Note: Booking will only be considered if it has been
                        done within 7 days prior from the date of arrival of
                        guest and it will be on the basis of availability of
                        rooms. No cash payment for booking of guest house is
                        allowed.
                    </div>

                    {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                        htmlFor="email"
                        className="text-center"
                    >
                        Email:
                    </Label>
                    <Input
                        id="email"
                        placeholder="Your Email"
                        value={email}
                        className="col-span-3"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                        htmlFor="visitor-name"
                        className="text-center"
                    >
                        {"Visitor's Name:"}
                    </Label>
                    <Input
                        id="visitor-name"
                        placeholder="Your Name"
                        value={name}
                        className="col-span-3"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div> */}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-center">
                            Address:
                        </Label>
                        <Input
                            id="address"
                            placeholder="Your address"
                            value={address}
                            className="col-span-3"
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact" className="text-center">
                            Contact No./ Whatsapp No.:
                        </Label>
                        <Input
                            id="contact"
                            placeholder="Your contact number"
                            value={contactNumber}
                            className="col-span-3"
                            type="number"
                            onChange={(e) => {
                                setContactNumber(e.target.value);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="arrival-date" className="text-center">
                            Arrival Date:
                        </Label>
                        <div className="col-span-3">
                            <DemoContainer
                                // className="overflow-hidden"
                                components={["DatePicker", "DatePicker"]}
                            >
                                <DatePicker
                                    label="Select Date"
                                    value={arrivalDate}
                                    onChange={(newValue) =>
                                        setArrivalDate(newValue)
                                    }
                                />
                            </DemoContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="arrival-date" className="text-center">
                            Tentative Arrival Time:
                        </Label>
                        <div className="col-span-3">
                            <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                            >
                                <TimePicker
                                    label="Select Time"
                                    value={arrivalTime}
                                    onChange={(newValue) =>
                                        setArrivalTime(newValue)
                                    }
                                />
                            </DemoContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departure-date" className="text-center">
                            Departure Date:
                        </Label>
                        <div className="col-span-3">
                            <DemoContainer
                                components={["DatePicker", "DatePicker"]}
                            >
                                <DatePicker
                                    label="Select Date"
                                    value={departureDate}
                                    onChange={(newValue) =>
                                        setDepartureDate(newValue)
                                    }
                                />
                            </DemoContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departure-date" className="text-center">
                            Tentative Departure Time:
                        </Label>
                        <div className="col-span-3">
                            <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                            >
                                <TimePicker
                                    label="Select Time"
                                    value={departureTime}
                                    onChange={(newValue) =>
                                        setDepartureTime(newValue)
                                    }
                                />
                            </DemoContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-center">
                            Accomodation Type:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {(() => {
                                        switch (accomodation) {
                                            case "single":
                                                return "Single Occupancy";
                                            case "double":
                                                return "Double Occupancy";
                                            default:
                                                return "Select";
                                        }
                                    })()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={accomodation}
                                    onValueChange={setAccomodation}
                                >
                                    <DropdownMenuRadioItem value="single">
                                        Single Occupancy
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="double">
                                        Double Occupancy
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rooms" className="text-center">
                            No. of rooms required:
                        </Label>
                        <Input
                            id="rooms"
                            placeholder="Your answer"
                            type="number"
                            value={rooms}
                            className="col-span-3"
                            onChange={(e) => {
                                setRooms(e.target.value);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-center">
                            Request of Booking By:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {(() => {
                                        switch (requestBy) {
                                            case "staff":
                                                return "IIITA- Faculty/Officers/Staff";
                                            case "student":
                                                return "IIITA students";
                                            case "alumni":
                                                return "IIITA Alumni";
                                            case "other":
                                                return "Others";
                                            default:
                                                return "Select";
                                        }
                                    })()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={requestBy}
                                    onValueChange={setRequestBy}
                                >
                                    <DropdownMenuRadioItem value="staff">
                                        IIITA- Faculty/Officers/Staff
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="student">
                                        IIITA students
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="alumni">
                                        IIITA Alumni
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="other">
                                        Others
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-center">
                            Booking Type:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {(() => {
                                        switch (bookingType) {
                                            case "guest":
                                                return "Institute Guest";
                                            case "official":
                                                return "Official (Conference/Project)";
                                            case "personal":
                                                return "Personal";
                                            default:
                                                return "Select";
                                        }
                                    })()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={bookingType}
                                    onValueChange={setBookingType}
                                >
                                    <DropdownMenuRadioItem value="guest">
                                        Institute Guest
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="official">
                                        Official (Conference/Project)
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="personal">
                                        Personal
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purpose" className="text-center">
                            Booking Purpose:
                        </Label>
                        <Input
                            id="purpose"
                            placeholder="Your answer"
                            value={bookingPurpose}
                            className="col-span-3"
                            onChange={(e) => {
                                setBookingPurpose(e.target.value);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purpose" className="text-center">
                            Disclaimer:
                        </Label>
                        <div className="col-span-3 flex">
                            <Checkbox
                                checked={disclaimer}
                                onChange={handleDisclaimerChange}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <div style={{ marginLeft: 10 }}>
                                I do hereby confirm that I or Guest will abide
                                all rules & regulations of Guest House (VH)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id_picture" className="text-center">
                            ID Proof:
                        </Label>
                        <Input
                            id="id_picture"
                            type="file"
                            className="col-span-3"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mx-5 my-5 font-sans sm:font-sans">
                        <div className="text-lg font-semibold">
                            Rules and Regulations
                        </div>

                        <ul className="list-disc ml-5">
                            <li>
                                Kindly submit your Id card’s photocopy during
                                the time of check in to the security personnel
                                of the Guest house. Check out timings will be 24
                                hours from the time of arrival. Guests are
                                particularly requested to lock the door of their
                                rooms when going outside the room. The
                                management will not in any way whatsoever be
                                responsible for any loss / or damage to the
                                Guest's/property.
                            </li>
                            <li>
                                The rooms are equipped with ‘instant geysers’,
                                it should be switched off immediately after use.
                            </li>
                            <li>
                                Please keep your room keys safely as there are
                                no duplicates available. You can also drop down
                                the keys at the security desk.
                            </li>
                            <li>No pets are allowed at Visitors Hostel.</li>
                            <li>
                                Bringing goods or any other article of
                                combustible or hazardous in nature, and/or
                                prohibited goods, and/or goods of objectionable
                                nature is strictly prohibited.
                            </li>
                            <li>
                                Please use the electricity and water
                                responsibly.
                            </li>
                            <li>
                                It is agreed that the guest will conduct him/
                                herself in a respectable manner and will not
                                cause any nuisance or annoyance within the
                                Visitors Hostel premise.
                            </li>
                        </ul>
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#598dcd]"
                        onClick={handleCreateBooking}
                    >
                        Submit
                    </Button>
                </div>
            </LocalizationProvider>
        </>
    );
};

export default VHBookingForm;
