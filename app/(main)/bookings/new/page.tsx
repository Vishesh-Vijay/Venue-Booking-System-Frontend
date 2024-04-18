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
    getAllBuildings,
    getVenueByBuilding,
    getBookingDetailsByVenue,
} from "@/utils/utils";
import { toast } from "sonner";
import BuildingSelection from "@/components/BuildingSelection/page";
import VenueSelection from "@/components/VenueSelection/page";
import DateTimeSelection from "@/components/DateTimeSelection/page";
import AdditionalBookingDetails from "@/components/AdditionalBookingDetails/page";
import moment from "moment-timezone";
interface Venue {
    authority_id: string;
    building_id: string;
    floor_number: Number;
    has_air_conditioner: Boolean;
    has_projectors: Boolean;
    has_speakers: Boolean;
    has_whiteboard: Boolean;
    id: string;
    is_accessible: Boolean;
    name: string;
    seating_capacity: Number;
    venue_type: string;
}

interface Building {
    id: string;
    name: string;
    building_picture: string;
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
const AddNewBooking = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [buildings, setBuildings] = useState<Array<Building>>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
        null
    );
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Array<Event>>([]);
    const [eventTime, setEventTime] = useState<string>("");
    const [eventDuration, setEventDuration] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [bookingType, setBookingType] = useState<string>("");
    const [expectedStrength, setExpectedStrength] = useState<string>("");
    const [bookingTypeOptions, setBookingTypeOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };
    const handleNext = () => {
        if (currentStep === 1) {
            if (selectedBuildingId) {
                setCurrentStep(currentStep + 1);
            } else {
                toast("Please select a building.", {
                    style: {
                        backgroundColor: "red",
                    },
                });
            }
        } else if (currentStep === 2) {
            if (selectedVenueId) {
                setCurrentStep(currentStep + 1);
            } else {
                toast("Please select a venue.", {
                    style: {
                        backgroundColor: "red",
                    },
                });
            }
        } else if (currentStep === 3) {
            if (eventTime && eventDuration) {
                setCurrentStep(currentStep + 1);
            } else {
                toast("Please select booking time.", {
                    style: {
                        backgroundColor: "red",
                    },
                });
            }
        } else if (currentStep === 4) {
            if (title && description && bookingType && expectedStrength) {
                handleNewBooking();
            } else {
                toast("Please fill all the required fields"),
                    {
                        style: {
                            backgroundColor: "red",
                        },
                    };
            }
        }
    };

    const handleBuildingSelect = (buildingId: string) => {
        setSelectedBuildingId(buildingId);
    };
    const handleVenueSelect = (venueId: string) => {
        setSelectedVenueId(venueId);
    };
    const handleSetEventTime = (time: string) => {
        setEventTime(time);
    };
    const handleEventDuration = (dur: number) => {
        setEventDuration(dur);
    };
    const handleTitleChange = (value: string) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    };

    const handleBookingTypeChange = (value: string) => {
        setBookingType(value);
    };

    const handleExpectedStrengthChange = (value: string) => {
        setExpectedStrength(value);
    };

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const buildingrDetails: any = await getAllBuildings(
                token as string
            ).then((res) => {
                const resp: any = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    setBuildings(data);
                    setLoading(false);
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 1000);
                }
            });
        } catch (error: any) {
            // Handle error
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
    const fetchVenues = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const venueDetails: any = await getVenueByBuilding(
                selectedBuildingId as string,
                token as string
            ).then((res) => {
                const resp: any = res;
                if (resp.status == 200) {
                    const data = resp.data.response_data;
                    setVenues(data);
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
    const handleNewBooking = async () => {
        const venueId = selectedVenueId ?? "";

        try {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user") as string;
            const response = await createBooking(
                {
                    title,
                    description,
                    user_id: user,
                    venue_id: venueId,
                    booking_type: bookingType,
                    event_time: moment(eventTime).local().format(),
                    event_duration: eventDuration,
                    expected_strength: parseInt(expectedStrength),
                },
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
                        "Booking Created Successfully! Check Bookings Tab for further updates",
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
    useEffect(() => {
        fetchBuildings();
    }, []);
    useEffect(() => {
        if (currentStep === 2) fetchVenues();
        if (currentStep === 3) fetchBookings();
        if (currentStep === 4) {
            const options = ["ACADEMIC", "WORKSHOP", "EVENT", "OTHER"];
            setBookingTypeOptions(options);
        }
    }, [currentStep]);
    return (
        <>
            <div className="text-3xl font-semibold my-4 text-center">
                Create New Booking
            </div>

            {currentStep === 1 && (
                <BuildingSelection
                    buildings={buildings}
                    selectedBuildingId={selectedBuildingId}
                    onSelectBuilding={handleBuildingSelect}
                />
            )}
            {currentStep === 2 && (
                <VenueSelection
                    venues={venues}
                    selectedVenueId={selectedVenueId}
                    onSelectVenue={handleVenueSelect}
                    buildings={buildings}
                />
            )}
            {currentStep === 3 && (
                <DateTimeSelection
                    bookings={bookings}
                    eventTime={eventTime}
                    eventDuration={eventDuration}
                    onEventTimeChange={handleSetEventTime}
                    onEventDurationChange={handleEventDuration}
                />
            )}
            {currentStep === 4 && (
                <AdditionalBookingDetails
                    title={title}
                    description={description}
                    bookingType={bookingType}
                    bookingTypeOptions={bookingTypeOptions}
                    expectedStrength={parseInt(expectedStrength)}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                    onBookingTypeChange={handleBookingTypeChange}
                    onExpectedStrengthChange={handleExpectedStrengthChange}
                />
            )}
            <div className="flex justify-center mt-8">
                <Button className="mr-4" onClick={handleBack}>
                    Back
                </Button>
                <Button className="ml-4" onClick={handleNext}>
                    {currentStep === 2
                        ? "Check Availability"
                        : currentStep === 3
                        ? "Complete Additional Details"
                        : currentStep === 4
                        ? "Submit"
                        : "Next"}
                </Button>
            </div>
        </>
    );
};

export default AddNewBooking;
