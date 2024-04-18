// import React from 'react'
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import {
  getBookingDetails,
  updateBookingRequest,
  getBookingRequestDetails,
  getCommentsByBooking,
  getUserDetailsByEmail,
  postComment,
} from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { IoCalendarOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";
import { GiDuration } from "react-icons/gi";
import { toast } from "sonner";
import moment from "moment-timezone";
import { ScrollArea } from "@/components/ui/scroll-area";
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
interface BookingRequestProps {
  booking_id: string;
  id: string;
  last_updated_time: string;
  receiver_id: string;
  request_status: string;
}
const CommentSection: React.FC<CommentSectionProps> = ({ bookingId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reload,setReload]=useState(false)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token: string = localStorage.getItem("token") as string;
        const response: any = await getCommentsByBooking(bookingId, token);
        if (response.status === 200) {
          const commentData = await Promise.all(
            response.data.response_data.map(async (comment: Comment) => {
              const userResponse: any = await getUserDetailsByEmail(
                comment.user_id as string,
                token
              );
              return { ...comment, user: userResponse.data.response_data.name };
            })
          );
          setComments(commentData);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [bookingId,reload]);

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
          setReload((val)=>!val)
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
                  <span className="text-sm text-white">
                    {"  "}
                    {new Date(comment.comment_time).toLocaleString()}
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
const BookingRequestDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsProps>();
  const [bookingRequestDetails, setBookingRequestDetails] =
    useState<BookingRequestProps>();
  const [updatePage, setUpdatePage] = useState(true);
  useEffect(() => {
    const getBookingRequestDetailsById = async () => {
      const token = localStorage.getItem("token");
      const response = await getBookingRequestDetails(
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
      const response = await getBookingDetails(
        bookingRequestDetails?.booking_id as string,
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
    getBookingRequestDetailsById();
  }, [params.id, updatePage, bookingRequestDetails?.booking_id]);
  function convertISOToUTC(isoTimeString: Date) {
    const date = new Date(isoTimeString);
    console.log(date);
    // const year = date.getUTCFullYear();
    // const month = date.getUTCMonth() + 1; // Adding 1 because getUTCMonth() returns zero-based month index
    // const day = date.getUTCDate();
    // const dateString = moment(date).tz('Asia/Kolkata').format('YYYY-MM-DD');
    const dateString = moment(date).utc().format("YYYY-MM-DD");
    // const hourString = moment(date).tz('Asia/Kolkata').format('HH:mm');
    const hourString = moment(date).utc().format("HH:mm");

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
  const lastUpdatedDate = new Date(bookingDetails?.last_updated_time as string);
  const lastUpdatedDateString = convertISOToUTC(lastUpdatedDate);

  const handleUpdateBookingRequest = async (status: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await updateBookingRequest(
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
              <h1 className="text-4xl font-semibold">{bookingDetails.title}</h1>
              <Badge
                variant="outline"
                className={
                  bookingDetails.booking_status == "PENDING"
                    ? "border-blue-400 text-blue-400 px-4 py-2 border-2 font-bold mt-2"
                    : bookingDetails.booking_status == "CANCELLED"
                    ? "border-yellow-400 text-yellow-400 px-4 py-2 border-2 font-bold mt-2"
                    : bookingDetails.booking_status == "REJECTED"
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
                <span className="text-gray-400">{dateString}</span>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <div className="flex items-center justify-center">
                  <CiTimer className="w-5 h-5 text-gray-400 mr-1 mt-0.5" />
                  <span className="text-gray-400">{timeString} hrs</span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-start space-y-4 mt-4">
              <h1>
                <span className="font-semibold">Description:</span>{" "}
                {bookingDetails.description}
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Expected Strength:</span>{" "}
                {String(bookingDetails.expected_strength)}
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Duration:</span>{" "}
                {String(bookingDetails.event_duration)} Minutes
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Booking Time:</span>{" "}
                {bookingDateString.date +
                  " at " +
                  bookingDateString.time +
                  " hrs"}
              </h1>
              <h1>
                {" "}
                <span className="font-semibold">Last Updated Time:</span>{" "}
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
                onClick={() => handleUpdateBookingRequest("APPROVED")}
              >
                Approve
              </Button>
              <Button
                className="bg-red-400"
                onClick={() => handleUpdateBookingRequest("REJECTED")}
              >
                Reject
              </Button>
            </div>
          )}
        </>
      )}
      <div className="flex items-center justify-between mx-12">
        <div className="w-full p-5 border-2 rounded-xl h-96 border-blue">
          <h2 className="text-center text-2xl font-bold">Comments</h2>
          {bookingDetails ? (
            <CommentSection bookingId={bookingDetails.id as string} />
          ) : (
            <h2 className="text-center font-semibold text-2xl">No Comments</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingRequestDetails;
