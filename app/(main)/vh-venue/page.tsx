/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField, MenuItem, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import VHVenueCard from "@/components/VHVenueCard/page";
import {
    addNewVHVenue,
    getAllBuildings,
    getAllVHVenues,
    getVHVenuesByAuthority,
} from "@/utils/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Span } from "next/dist/trace";
import { access } from "fs";
interface VHVenue {
    authority_id: string; //email
    building_id: string; //id
    floor_number: Number;
    id: string; //id
    name: string;
    accomodation_type: string;
}
interface Building {
    id: string;
    name: string;
}
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
const VHVenue = () => {
    const router = useRouter();
    if (
        localStorage.getItem("admin") == "no" &&
        localStorage.getItem("Authority") == "no"
    ) {
        router.push("/");
        return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [venues, setVenues] = useState<Array<VHVenue>>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showAlert, setShowAlert] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isError, setIsError] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [newVenue, setNewVenue] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [addVenueLoading, setAddVenueLoading] = React.useState(false);
    const [addVenueAlert, setAddVenueAlert] = useState(false);
    const [isNewVenueError, setIsNewVenueError] = React.useState(false);
    const [newVenueError, setNewVenueError] = React.useState("");
    const [open, setOpen] = useState(false);
    const [resetVenues, setResetVenues] = useState(false);
    const [buildings, setBuildings] = useState<Array<Building>>([]);
    const [floor, setFloor] = useState("");
    const [accomodationType, setAccomodationType] = useState("");
    const [authority, setAuthority] = useState("");
    const [building, setBuilding] = useState("");

    const [filteredVenues, setFilteredVenues] = useState<Array<VHVenue>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [buildingFilter, setBuildingFilter] = useState(null);
    const [accomodationTypeFilter, setAccomodationTypeFilter] = useState(null);

    const accomodationTypeOptions = ["SINGLE", "DOUBLE", "OTHER"];
    const handleCreateVHVenue = async () => {
        setOpen(false);
        setAddVenueLoading(true);
        try {
            const token = localStorage.getItem("token");
            const buildingId = buildings.find(
                (buildin) => buildin.name === building
            ) as Building;
            const props = {
                name: newVenue,
                authority_id: authority,
                building_id: buildingId.id as string,
                floor_number: parseInt(floor, 10),
                accomodation_type: accomodationType.toUpperCase(),
            };
            const response: any = addNewVHVenue(props, token as string).then(
                (res: any) => {
                    if (res.status == 200) {
                        setAddVenueLoading(false);
                        toast("Venue Added Sucessfully!", {
                            style: {
                                backgroundColor: "#00fa9a",
                            },
                        });
                        setNewVenue("");
                        setResetVenues((val) => !val);
                    }
                }
            );
        } catch (error: any) {
            toast(
                `${
                    error.response?.data?.response_message || "An error occured"
                }`,
                {
                    style: {
                        backgroundColor: "red",
                    },
                }
            );
        } finally {
            setAddVenueLoading(false);
        }
    };
    const filterVenues = () => {
        let filtered = venues;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((venue) =>
                venue.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (buildingFilter) {
            filtered = filtered.filter(
                (venue) => venue.building_id === buildingFilter
            );
        }

        if (accomodationTypeFilter) {
            filtered = filtered.filter(
                (venue) => venue.accomodation_type === accomodationTypeFilter
            );
        }
        setFilteredVenues(filtered);
    };
    const handleBuildingChange = (event: any) => {
        setBuildingFilter(event.target.value);
    };

    const handleVenueTypeChange = (event: any) => {
        setAccomodationTypeFilter(event.target.value);
    };
    useEffect(() => {
        filterVenues();
    }, [searchQuery, buildingFilter, accomodationTypeFilter, venues]);
    useEffect(() => {
        const getBuildings = async () => {
            try {
                const token = localStorage.getItem("token");
                const userDetails: any = await getAllBuildings(
                    token as string
                ).then((res: any) => {
                    const resp: any = res;
                    if (resp.status == 200) {
                        const data = resp.data.response_data;
                        // console.log(data)  ;

                        setBuildings(data);
                        // setLoading(false);
                        // setShowAlert(true);
                        // setTimeout(() => {
                        //   setShowAlert(false);
                        // }, 1000);
                    }
                });
            } catch (error: any) {
                // Handle error
                console.log(error);
                // setIsError(true);
                // setError(error.response.data.response_message);
                // setTimeout(() => {
                //   setIsError(false);
                //   setError("");
                // }, 3000);
            } finally {
                setLoading(false);
            }
        };
        const getVenues = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (localStorage.getItem("admin") === "yes") {
                    const response: any = await getAllVHVenues(
                        token as string
                    ).then((res: any) => {
                        const resp: any = res;
                        if (resp.status == 200) {
                            const data = resp.data.response_data;
                            setVenues(data);
                            setLoading(false);
                        }
                    });
                } else {
                    const user = localStorage.getItem("user");
                    const response: any = await getVHVenuesByAuthority(
                        user as string,
                        token as string
                    ).then((res: any) => {
                        const resp: any = res;
                        console.log(resp);
                        if (resp.status == 200) {
                            const data = resp.data.response_data;
                            setVenues(data);
                            setLoading(false);
                        }
                    });
                }
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getBuildings();
        getVenues();
    }, [resetVenues]);
    return (
        <div className="p-4">
            <div className="flex gap-5 items-center mt-4 px-6">
                <h1 className="font-semibold text-4xl">Venues</h1>
                <div className="">
                    <Dialog open={open} onOpenChange={setOpen}>
                        {localStorage.getItem("admin") === "yes" && (
                            <DialogTrigger>
                                <Button className="bg-[#598dcd] flex items-center justify-center rounded-3xl">
                                    <span>Add Venue</span>
                                    <IoAddCircleOutline className="ml-4 w-5 h-5 mt-0.5" />
                                </Button>
                            </DialogTrigger>
                        )}
                        <DialogContent
                            style={{ maxHeight: "70vh", overflowY: "auto" }}
                        >
                            <DialogHeader>
                                <DialogTitle>Create New Venue</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-center"
                                    >
                                        Name:
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="New Venue"
                                        value={newVenue}
                                        className="col-span-3"
                                        onChange={(e) => {
                                            setNewVenue(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="building"
                                        className="text-center"
                                    >
                                        Building:
                                    </Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                Select
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup
                                                value={building}
                                                onValueChange={setBuilding}
                                            >
                                                {buildings.length > 0 ? (
                                                    buildings.map(
                                                        (build, index) => (
                                                            <div key={index}>
                                                                <DropdownMenuRadioItem
                                                                    value={
                                                                        build.name
                                                                    }
                                                                >
                                                                    {build.name}
                                                                </DropdownMenuRadioItem>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span>
                                                        No buildings yet! Create
                                                        one first
                                                    </span>
                                                )}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="floor"
                                        className="text-center"
                                    >
                                        Floor:
                                    </Label>
                                    <Input
                                        id="floor"
                                        placeholder="Floor"
                                        value={floor}
                                        className="col-span-3"
                                        onChange={(e) => {
                                            setFloor(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Accomodation Type:
                                    </Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                Select
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup
                                                value={accomodationType}
                                                onValueChange={
                                                    setAccomodationType
                                                }
                                            >
                                                <DropdownMenuRadioItem value="Single">
                                                    Single
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Double">
                                                    Double
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Other">
                                                    Other
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="authority"
                                        className="text-center"
                                    >
                                        Authority Email:
                                    </Label>
                                    <Input
                                        id="authority"
                                        placeholder="Authority Email"
                                        value={authority}
                                        className="col-span-3"
                                        onChange={(e) => {
                                            setAuthority(e.target.value);
                                        }}
                                    />
                                </div>
                                {/* Other form fields */}
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="bg-[#598dcd]"
                                    onClick={() => handleCreateVHVenue()}
                                >
                                    Create
                                </Button>
                                <Button
                                    type="reset"
                                    onClick={() => {
                                        setNewVenue("");
                                        setBuilding("");
                                        setAuthority("");
                                        setFloor("");
                                        setAccomodationType("");
                                        setOpen((val) => !val);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="px-6 mt-6 flex items-center gap-4">
                {/* Other UI components */}
            </div>
            {loading === false ? (
                <ScrollArea className="h-[550px] mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((Venue, index) => (
                                <div
                                    key={index}
                                    className="mt-2 flex flex-col justify-center items-center"
                                >
                                    <VHVenueCard
                                        accomodation_type={
                                            Venue.accomodation_type as string
                                        }
                                        floor_number={
                                            Venue.floor_number as Number
                                        }
                                        building_id={
                                            Venue.building_id as string
                                        }
                                        authority_id={
                                            Venue.authority_id as string
                                        }
                                        name={Venue.name as string}
                                        id={Venue.id as string}
                                        resetVenue={resetVenues}
                                        setResetVenue={() =>
                                            setResetVenues((val) => !val)
                                        }
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full mt-12 text-center font-bold text-2xl">
                                No Venues found
                            </div>
                        )}
                    </div>
                </ScrollArea>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
};

export default VHVenue;
