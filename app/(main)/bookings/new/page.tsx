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
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNext = () => {
        if (selectedBuildingId) {
            setCurrentStep(currentStep + 1);
        } else {
            toast("Please select a building.", {
                style: {
                    backgroundColor: "red",
                },
            });
        }
    };

    const handleBuildingSelect = (buildingId: string) => {
        setSelectedBuildingId(buildingId);
    };

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const userDetails: any = await getAllBuildings(
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
    useEffect(() => {
        fetchBuildings();
    }, []);
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
            <div className="flex justify-center mt-8">
                <Button className="mr-4" onClick={handleBack}>
                    Back
                </Button>
                <Button className="ml-4" onClick={handleNext}>
                    Next
                </Button>
            </div>
        </>
    );
};

export default AddNewBooking;
