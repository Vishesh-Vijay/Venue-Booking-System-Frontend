"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import {
    getVHBookingDetails,
    updateVHBookingRequest,
    getVHBookingRequestDetails,
} from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { IoCalendarOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";
import { GiDuration } from "react-icons/gi";
import { toast } from "sonner";
import moment from "moment-timezone";
import { ScrollArea } from "@/components/ui/scroll-area";
interface VHBookingDetailsProps {
    booking_status?: string;
    booking_time?: string;
    booking_type?: string;
    arrival_time?: string;
    departure_time?: string;
    id?: string;
    last_updated_time?: string;
    user_id?: string;
}

interface BookingRequestProps {
    booking_id: string;
    id: string;
    last_updated_time: string;
    receiver_id: string;
    request_status: string;
}

const BookingRequestDetails = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [bookingDetails, setBookingDetails] =
        useState<VHBookingDetailsProps>();
    const [bookingRequestDetails, setBookingRequestDetails] =
        useState<BookingRequestProps>();
    const [updatePage, setUpdatePage] = useState(true);
    useEffect(() => {
        const getBookingRequestDetailsById = async () => {
            const token = localStorage.getItem("token");
            const response = await getVHBookingRequestDetails(
                params.id,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    // console.log(data);
                    setBookingRequestDetails(data);
                    getBookingDetailsById();
                }
            });
        };
        const getBookingDetailsById = async () => {
            const token = localStorage.getItem("token");
            const response = await getVHBookingDetails(
                bookingRequestDetails?.booking_id as string,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    console.log(data);
                    setBookingDetails(data);
                }
            });
        };
        getBookingRequestDetailsById();
    }, [params.id, updatePage, bookingRequestDetails?.booking_id]);
    function convertISOToUTC(isoTimeString: Date) {
        const date = new Date(isoTimeString);
        console.log(date);

        const dateString = moment(date).local().format("DD-MM-YYYY");

        const hourString = moment(date).local().format("hh:mm A");

        return {
            date: dateString,
            time: hourString,
        };
    }
    const date = new Date(bookingDetails?.arrival_time as string);
    const dateString = convertISOToUTC(date).date;
    const timeString = convertISOToUTC(date).time;
    const bookingDate = new Date(bookingDetails?.booking_time as string);
    const bookingDateString = convertISOToUTC(bookingDate);
    const lastUpdatedDate = new Date(
        bookingDetails?.last_updated_time as string
    );
    const lastUpdatedDateString = convertISOToUTC(lastUpdatedDate);

    const handleUpdateBookingRequest = async (status: string) => {
        const token = localStorage.getItem("token");
        try {
            const response = await updateVHBookingRequest(
                params.id,
                status,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    setUpdatePage((val) => !val);
                    toast("Updated Booking Request!", {
                        style: {
                            backgroundColor: "#00fa9a",
                        },
                    });
                }
            });
        } catch (error: any) {
            toast(`${error?.response?.response_data?.message}`, {
                style: {
                    backgroundColor: "red",
                },
            });
        }
    };

    return (
        <div className="p-4">
            {bookingDetails && (
                <>
                    <div className="flex w-full justify-between items-center mt-4">
                        <h1 className="w-5/6 text-center font-semibold text-4xl">
                            Booking Request Details
                        </h1>
                        <div className="w-1/6 flex justify-center items-end">
                            <Button
                                variant="default"
                                className="bg-[#313465] text-white flex items-center justify-between"
                                onClick={() => {
                                    router.push("/bookings/requests");
                                }}
                            >
                                <IoArrowBack className="w-4 h-4 mr-1 mt-0.5" />
                                <span>Back</span>
                            </Button>
                        </div>
                    </div>
                    <div className="mx-24 my-8">
                        <div className="flex justify-between items-center">
                            <Badge
                                variant="outline"
                                className={
                                    bookingDetails.booking_status == "PENDING"
                                        ? "border-blue-400 text-blue-400 px-4 py-2 border-2 font-bold mt-2"
                                        : bookingDetails.booking_status ==
                                          "CANCELLED"
                                        ? "border-yellow-400 text-yellow-400 px-4 py-2 border-2 font-bold mt-2"
                                        : bookingDetails.booking_status ==
                                          "REJECTED"
                                        ? "border-red-400 text-red-400 px-4 py-2 border-2 font-bold mt-2"
                                        : "border-green-400 text-green-400 px-4 py-2 border-2 font-bold mt-2"
                                }
                            >
                                {bookingDetails.booking_status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-xl">
                            <div className="flex justify-left items-center">
                                <IoCalendarOutline className="w-5 h-5 text-gray-400 mr-1" />
                                <span className="text-gray-400">
                                    {dateString}
                                </span>
                            </div>
                            <div className="flex flex-col justify-center items-center mr-2">
                                <div className="flex items-center justify-center">
                                    <CiTimer className="w-5 h-5 text-gray-400 mr-1 mt-0.5" />
                                    <span className="text-gray-400">
                                        {timeString} hrs
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-center items-start space-y-4 mt-4">
                            <h1>
                                {" "}
                                <span className="font-semibold">
                                    Booking Time:
                                </span>{" "}
                                {bookingDateString.date +
                                    " at " +
                                    bookingDateString.time +
                                    " hrs"}
                            </h1>
                            <h1>
                                {" "}
                                <span className="font-semibold">
                                    Last Updated Time:
                                </span>{" "}
                                {lastUpdatedDateString.date +
                                    " at " +
                                    lastUpdatedDateString.time +
                                    " hrs"}
                            </h1>
                        </div>
                    </div>
                    {bookingDetails.booking_status == "PENDING" && (
                        <div className="mt-4 flex justify-center items-center space-x-5">
                            <Button
                                className="bg-green-400"
                                onClick={() =>
                                    handleUpdateBookingRequest("APPROVED")
                                }
                            >
                                Approve
                            </Button>
                            <Button
                                className="bg-red-400"
                                onClick={() =>
                                    handleUpdateBookingRequest("REJECTED")
                                }
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BookingRequestDetails;
