"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import {
    getBookingDetails,
    getCommentsByBooking,
    postComment,
    getUserDetailsByEmail,
    getBookingDetailsByVenue,
    editBooking,
} from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { IoCalendarOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";
import { GiDuration } from "react-icons/gi";
import moment from "moment-timezone";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import DateTimeSelection from "@/components/DateTimeSelection/page";
interface BookingDetailsProps {
    booking_status?: string;
    booking_time?: string;
    booking_type?: string;
    description?: string;
    event_duration?: Number;
    event_time?: string;
    expected_strength?: Number;
    id?: string;
    last_updated_time?: string;
    title?: string;
    user_id?: string;
    venue_id?: string;
}
interface Event {
    booking_status: string;
    booking_time: string;
    booking_type: string;
    description: string;
    event_duration: number;
    event_time: Date;
    expected_strength: number;
    id: string;
    last_updated_time: string;
    title: string;
    user_id: string;
    venue_id: string;
}
interface Comment {
    id: string;
    comment_time: string;
    user_id: string;
    comment_content: string;
    user?: string;
}
interface CommentSectionProps {
    bookingId: string;
}
const CommentSection: React.FC<CommentSectionProps> = ({ bookingId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [reload, setReload] = useState(false);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token: string = localStorage.getItem("token") as string;
                const response: any = await getCommentsByBooking(
                    bookingId,
                    token
                );
                if (response.status === 200) {
                    const commentData = await Promise.all(
                        response.data.response_data.map(
                            async (comment: Comment) => {
                                const userResponse: any =
                                    await getUserDetailsByEmail(
                                        comment.user_id as string,
                                        token
                                    );
                                return {
                                    ...comment,
                                    user: userResponse.data.response_data.name,
                                };
                            }
                        )
                    );
                    setComments(commentData);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [bookingId, reload]);

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        if (newComment == "") {
            toast(`${"Comment is Empty!"}`, {
                style: {
                    backgroundColor: "red",
                },
            });
            return;
        }
        event.preventDefault();

        try {
            const userid = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            const resp: any = await postComment(
                bookingId as string,
                userid as string,
                newComment as string,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    setNewComment("");
                    setReload((val) => !val);
                    toast("Comment Posted!", {
                        style: {
                            backgroundColor: "#00fa9a",
                        },
                    });
                }
            });
        } catch (error: any) {
            toast(`${error.response.response_data.message}`, {
                style: {
                    backgroundColor: "red",
                },
            });
        }
    };
    const currentUser: string = localStorage.getItem("user") as string;
    return (
        <div>
            <ScrollArea className="h-48">
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className={`flex ${
                                comment.user_id === currentUser
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`bg-[#313465] rounded-lg p-4 max-w-[80%] ${
                                    comment.user_id === currentUser
                                        ? " text-white ml-4"
                                        : "bg-blue-500"
                                }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                        {comment.user_id === currentUser
                                            ? "YOU "
                                            : (comment?.user as string)}
                                    </span>
                                    <span className="text-sm text-white ml-2">
                                        {"  "}
                                        {moment
                                            .utc(comment.comment_time)
                                            .format("YYYY-MM-DD HH:mm:ss")}
                                    </span>
                                </div>
                                <p>{comment.comment_content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </ScrollArea>

            <form onSubmit={handleCommentSubmit} className="mt-4">
                <label htmlFor="new-comment" className="block font-bold mb-2">
                    Add a comment:
                </label>
                <div className="flex justify-center items-center">
                    <textarea
                        id="new-comment"
                        value={newComment}
                        onChange={handleCommentChange}
                        className="w-full mr-4 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
const BookingDetails = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [bookingDetails, setBookingDetails] = useState<BookingDetailsProps>();
    const [bookings, setBookings] = useState<Array<Event>>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [eventTime, setEventTime] = useState<string>("");
    const [eventDuration, setEventDuration] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    useEffect(() => {
        const getBookingDetailsById = async () => {
            const token = localStorage.getItem("token");
            const response = await getBookingDetails(
                params.id,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    console.log(data);
                    setSelectedVenueId(data.venue_id);
                    setBookingDetails(data);
                }
            });
        };
        getBookingDetailsById();
    }, [params.id]);
    function convertISOToUTC(isoTimeString: Date) {
        const date = new Date(isoTimeString);

        // const dateString = moment(date).utc().format('YYYY-MM-DD');
        const dateString = moment(date).local().format("DD-MM-YYYY");
        // const hourString = moment(date).tz('Asia/Kolkata').format('HH:mm');
        const hourString = moment(date).local().format("hh:mm A");
        // const hourString = moment(date).utc().format('HH:mm');

        // const hours =
        //   date.getMinutes() >= 30 ? date.getHours() - 5 : date.getHours() - 6;
        // const minutes =
        //   date.getMinutes() >= 30 ? date.getMinutes() - 30 : 30 + date.getMinutes();
        // const seconds = date.getUTCSeconds();

        return {
            date: dateString,
            time: hourString,
        };
    }
    const date = new Date(bookingDetails?.event_time as string);
    const dateString = convertISOToUTC(date).date;
    const timeString = convertISOToUTC(date).time;
    const bookingDate = new Date(bookingDetails?.booking_time as string);
    const bookingDateString = convertISOToUTC(bookingDate);
    const lastUpdatedDate = new Date(
        bookingDetails?.last_updated_time as string
    );
    const lastUpdatedDateString = convertISOToUTC(lastUpdatedDate);
    const handleEditRequest = () => {
        console.log("clicked edit");
        setCurrentStep(2);
    };

    const handleTimeRequest = () => {
        if (eventTime && eventDuration) {
            // console.log(eventTime, eventDuration)
            handleEditBooking();
        } else {
            toast("Please select booking time.", {
                style: {
                    backgroundColor: "red",
                },
            });
        }
    };

    const handleEditBooking = async () => {
        const venueId = selectedVenueId;

        try {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user") as string;
            const booking_id = bookingDetails?.id;
            const event_time = moment(eventTime).local().format();
            const event_duration = bookingDetails?.event_duration;
            const response = await editBooking(
                booking_id as string,
                event_time as string,
                event_duration as number,
                token as string
            ).then((res: any) => {
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
                        "Booking Edited Successfully! Check Bookings Tab for further updates",
                        {
                            style: {
                                backgroundColor: "#00fa9a",
                            },
                        }
                    );
                }
            });
        } catch (error: any) {
            setIsError(true);
            setError(error.response.data.response_message);
            setTimeout(() => {
                setIsError(false);
                setError("");
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSetEventTime = (time: string) => {
        setEventTime(time);
    };
    const handleEventDuration = (dur: number) => {
        setEventDuration(dur);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const bookingDetails: any = await getBookingDetailsByVenue(
                selectedVenueId as string,
                token as string
            ).then((res) => {
                const resp: any = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    setBookings(data);
                    setLoading(false);
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 1000);
                }
            });
        } catch (error: any) {
            setIsError(true);
            setError(error.response.data.response_message);
            setTimeout(() => {
                setIsError(false);
                setError("");
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentStep === 2) fetchBookings();
    }, [currentStep]);
    return (
        <>
            {currentStep === 1 && (
                <div className="p-4">
                    {bookingDetails && (
                        <>
                            <div className="flex w-full justify-between items-center mt-4">
                                <h1 className="w-5/6 text-center font-semibold text-4xl">
                                    Booking Details
                                </h1>
                                <div className="w-1/6 flex justify-center items-end">
                                    <Button
                                        variant="default"
                                        className="bg-[#313465] text-white flex items-center justify-between"
                                        onClick={() => {
                                            router.push("/bookings");
                                        }}
                                    >
                                        <IoArrowBack className="w-4 h-4 mr-1 mt-0.5" />
                                        <span>Back</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="mx-24 my-16">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-4xl font-semibold">
                                        {bookingDetails.title}
                                    </h1>
                                    <Badge
                                        variant="outline"
                                        className={
                                            bookingDetails.booking_status ==
                                            "PENDING"
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
                                    <h1>{bookingDetails.description}</h1>
                                    <h1>
                                        {" "}
                                        <span className="font-semibold">
                                            Expected Strength:
                                        </span>{" "}
                                        {String(
                                            bookingDetails.expected_strength
                                        )}
                                    </h1>
                                    <h1>
                                        {" "}
                                        <span className="font-semibold">
                                            Duration:
                                        </span>{" "}
                                        {String(bookingDetails.event_duration)}{" "}
                                        Minutes
                                    </h1>
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
                        </>
                    )}
                    {bookingDetails?.booking_status?.toLowerCase() ===
                        "pending" && (
                        <Button
                            variant="default"
                            className="mr-2 bg-yellow-600"
                            onClick={handleEditRequest}
                        >
                            Edit Booking
                        </Button>
                    )}
                    <div className="flex items-center justify-between mx-12 mt-8">
                        <div className="w-full p-5 border-2 rounded-xl h-96 border-blue">
                            <h2 className="text-center text-2xl font-bold">
                                Comments
                            </h2>
                            {bookingDetails ? (
                                <CommentSection
                                    bookingId={bookingDetails.id as string}
                                />
                            ) : (
                                <h2 className="text-center font-semibold text-2xl">
                                    No Comments
                                </h2>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <>
                    <DateTimeSelection
                        bookings={bookings}
                        eventTime={eventTime}
                        eventDuration={eventDuration}
                        onEventTimeChange={handleSetEventTime}
                        onEventDurationChange={handleEventDuration}
                    />
                    <Button
                        variant="default"
                        className="mr-2 bg-green-600"
                        onClick={handleTimeRequest}
                    >
                        Submit
                    </Button>
                </>
            )}
        </>
    );
};

export default BookingDetails;
