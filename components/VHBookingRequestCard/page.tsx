"use client";
import React, { useEffect, useState } from "react";

interface BookingRequestCardProps {
    BookingId: string;
    //   status:string
    request_id: string;
}
import { useRouter } from "next/navigation";
import { IoLocateOutline, IoLocationOutline } from "react-icons/io5";
import moment from "moment-timezone";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
interface BookingDetailsProps {
    booking_status?: string;
    booking_time?: string;
    booking_type?: string;
    arrival_time?: string;
    departure_time?: string;
    id?: string;
    last_updated_time?: string;
    user_id?: string;
}
import { getVHBookingDetails } from "@/utils/utils";
import { MdOutlineTimer } from "react-icons/md";
import { Button } from "../ui/button";
const VHBookingRequestCard = (props: BookingRequestCardProps) => {
    const [bookingDetails, setBookingDetails] = useState<BookingDetailsProps>();
    useEffect(() => {
        const getBookingDetailsById = async () => {
            const token = localStorage.getItem("token");
            const response = await getVHBookingDetails(
                props.BookingId,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    console.log(data);
                    setBookingDetails(data);
                    //   bookingDetails?.booking_status==""?bookingDetails.booking_status = ""
                }
            });
        };

        getBookingDetailsById();
    }, [props.BookingId]);
    const inputDate = new Date(bookingDetails?.arrival_time as string);
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
    const monthIndex = parseInt(moment(inputDate).local().format("MM"));
    const day = parseInt(moment(inputDate).local().format("DD"));
    const year = parseInt(moment(inputDate).local().format("YYYY"));
    let hours = parseInt(moment(inputDate).local().format("HH"));
    const minutes = parseInt(moment(inputDate).local().format("mm"));

    // Convert hours to 12-hour format and determine AM/PM
    const amPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    // Format the date and time
    const formattedDateTime = `${months[monthIndex - 1]} ${day}${getDaySuffix(
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
    const handleViewDetails = () => {
        router.push(`/bookings/requests/${props.request_id}`);
    };

    return (
        <div className="w-full">
            {bookingDetails && (
                <Card className="bg-[#313465] text-white w-full  rounded-2xl flex justify-between items-start">
                    <div>
                        <CardHeader>
                            <CardDescription className="font-semibold">
                                {bookingDetails?.booking_type}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="flex items-center mt-2">
                                <MdOutlineTimer className="mr-1" />
                                {formattedDateTime}
                            </p>
                        </CardContent>
                    </div>
                    <div className="flex flex-col justify-between items-end h-36 mt-5 mr-5">
                        <CardFooter
                            className={
                                bookingDetails?.booking_status == "APPROVED"
                                    ? "text-[#53AB68]  bg-white p-3 rounded-2xl font-bold"
                                    : bookingDetails?.booking_status ==
                                      "REJECTED"
                                    ? "text-[#EB575A]  bg-white p-3 rounded-2xl font-bold"
                                    : bookingDetails?.booking_status ==
                                      "CANCELLED"
                                    ? "text-[#E6B664] bg-white p-3 rounded-2xl font-bold"
                                    : "text-[#5DB4F7]  bg-white p-3 rounded-2xl font-bold"
                            }
                        >
                            {(
                                bookingDetails?.booking_status as string
                            )[0].toUpperCase() +
                                (bookingDetails?.booking_status as string)
                                    .slice(
                                        1,
                                        (
                                            bookingDetails?.booking_status as string
                                        ).length
                                    )
                                    .toLowerCase()}
                        </CardFooter>
                        <div className="flex justify-between items-center">
                            <Button
                                variant="default"
                                className="mr-2 bg-green-600"
                                onClick={() => handleViewDetails()}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default VHBookingRequestCard;
