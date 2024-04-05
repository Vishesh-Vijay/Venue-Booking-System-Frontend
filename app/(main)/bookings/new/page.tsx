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
import BuildingSelection from "@/components/BuildingSelection/page";
import VenueSelection from "@/components/VenueSelection/page";
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

const AddNewBooking = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [buildings, setBuildings] = useState<Array<Building>>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
        null
    );
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
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
        }
    };

    const handleBuildingSelect = (buildingId: string) => {
        setSelectedBuildingId(buildingId);
    };
    const handleVenueSelect = (venueId: string) => {
        setSelectedVenueId(venueId);
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
                    // console.log(data);

                    setBuildings(data);
                    setLoading(false);
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 1000);
                }
            });

            // console.log(userDetails);
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
                    // console.log(data);

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
    useEffect(() => {
        fetchBuildings();
    }, []);
    useEffect(() => {
        if (currentStep === 2) fetchVenues();
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
                />
            )}
            <div className="flex justify-center mt-8">
                <Button className="mr-4" onClick={handleBack}>
                    Back
                </Button>
                <Button className="ml-4" onClick={handleNext}>
                    {currentStep === 2 ? "Check Availability" : "Next"}
                </Button>
            </div>
        </>
    );
};

export default AddNewBooking;
