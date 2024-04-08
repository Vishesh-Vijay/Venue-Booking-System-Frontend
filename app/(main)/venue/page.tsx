/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField, MenuItem, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import VenueCard from "@/components/VenueCard/page";
import {
    addNewVenue,
    getAllBuildings,
    getAllVenues,
    getVenuesByAuthority,
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
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
const Venue = () => {
    const router = useRouter();
    if (
        localStorage.getItem("admin") == "no" &&
        localStorage.getItem("Authority") == "no"
    ) {
        router.push("/");
        return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [venues, setVenues] = useState<Array<Venue>>([]);
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
    const [capacity, setCapacity] = useState("");
    const [venueType, setVenueType] = useState("");
    const [authority, setAuthority] = useState("");
    const [accessible, setAccesible] = useState("false");
    const [projectors, setProjectors] = useState("false");
    const [whiteboard, setWhiteboard] = useState("false");
    const [speakers, setSpeakers] = useState("false");
    const [building, setBuilding] = useState("");
    const [airConditioner, setAirConditioner] = useState("false");

    const [filteredVenues, setFilteredVenues] = useState<Array<Venue>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [buildingFilter, setBuildingFilter] = useState(null);
    const [venueTypeFilter, setVenueTypeFilter] = useState(null);

    const venueTypeOptions = [
        "CLASSROOM",
        "LAB",
        "MEETING_ROOM",
        "AUDITORIUM",
        "OTHER",
    ];
    const handleCreateVenue = async () => {
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
                seating_capacity: parseInt(capacity, 10),
                venue_type: venueType.toUpperCase(),
                is_accessible: accessible == "true" ? true : false,
                has_air_conditioner: airConditioner == "true" ? true : false,
                has_projectors: projectors == "true" ? true : false,
                has_speakers: speakers == "true" ? true : false,
                has_whiteboard: whiteboard == "true" ? true : false,
            };
            const response: any = addNewVenue(props, token as string).then(
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

        if (venueTypeFilter) {
            filtered = filtered.filter(
                (venue) => venue.venue_type === venueTypeFilter
            );
        }
        setFilteredVenues(filtered);
    };
    const handleBuildingChange = (event: any) => {
        setBuildingFilter(event.target.value);
    };

    const handleVenueTypeChange = (event: any) => {
        setVenueTypeFilter(event.target.value);
    };
    useEffect(() => {
        filterVenues();
    }, [searchQuery, buildingFilter, venueTypeFilter, venues]);
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
                    const response: any = await getAllVenues(
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
                    const response: any = await getVenuesByAuthority(
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
                // console.log(userDetails);
            } catch (error: any) {
                // Handle error
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
                <h1 className=" font-semibold text-4xl">Venues</h1>
                <div className="">
                    <Dialog open={open} onOpenChange={setOpen}>
                        {localStorage.getItem("admin") == "yes" && (
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
                                        htmlFor="capacity"
                                        className="text-center"
                                    >
                                        Capacity:
                                    </Label>
                                    <Input
                                        id="capacity"
                                        placeholder="Capacity"
                                        value={capacity}
                                        className="col-span-3"
                                        onChange={(e) => {
                                            setCapacity(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Type:
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
                                                value={venueType}
                                                onValueChange={setVenueType}
                                            >
                                                <DropdownMenuRadioItem value="Classroom">
                                                    Classroom
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Meeting Room">
                                                    Meeting Room
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Lab">
                                                    Lab
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Auditorium">
                                                    Auditorium
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Accessibility
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
                                                value={accessible}
                                                onValueChange={setAccesible}
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    Yes
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    No
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Air Conditioner:
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
                                                value={airConditioner}
                                                onValueChange={
                                                    setAirConditioner
                                                }
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    Yes
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    No
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Projectors:
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
                                                value={projectors}
                                                onValueChange={setProjectors}
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    Yes
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    No
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        White Board:
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
                                                value={whiteboard}
                                                onValueChange={setWhiteboard}
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    Yes
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    No
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="type"
                                        className="text-center"
                                    >
                                        Speakers:
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
                                                value={speakers}
                                                onValueChange={setSpeakers}
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    Yes
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    No
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="bg-[#598dcd]"
                                    onClick={() => handleCreateVenue()}
                                >
                                    Create
                                </Button>
                                <Button
                                    type="reset"
                                    onClick={() => {
                                        setNewVenue("");
                                        setBuilding("");
                                        setAuthority("");
                                        setAccesible("false");
                                        setAirConditioner("false");
                                        setCapacity("");
                                        setFloor("");
                                        setProjectors("false");
                                        setSpeakers("false");
                                        setVenueType("");
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
                <div className="w-1/2">
                    <TextField
                        id="search"
                        label="Search Venue"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <Box sx={{ minWidth: 120 }}>
                        <TextField
                            id="building-filter"
                            select
                            label="Filter by Building"
                            variant="outlined"
                            fullWidth
                            value={buildingFilter}
                            onChange={handleBuildingChange}
                        >
                            {buildings.map((building) => (
                                <MenuItem key={building.id} value={building.id}>
                                    {building.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </div>
                <div className="w-1/2">
                    <Box sx={{ minWidth: 120 }}>
                        <TextField
                            id="venue-type-filter"
                            select
                            label="Filter by Venue Type"
                            variant="outlined"
                            fullWidth
                            value={venueTypeFilter}
                            onChange={handleVenueTypeChange}
                        >
                            {venueTypeOptions.map((venueType) => (
                                <MenuItem key={venueType} value={venueType}>
                                    {venueType}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </div>
            </div>
            {loading == false ? (
                <ScrollArea className="h-[550px] mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((Venue, index) => (
                                <div
                                    key={index}
                                    className="mt-2 flex flex-col justify-center items-center"
                                >
                                    <VenueCard
                                        venue_type={Venue.venue_type as string}
                                        seating_capacity={
                                            Venue.seating_capacity as Number
                                        }
                                        is_accessible={
                                            Venue.is_accessible as Boolean
                                        }
                                        has_whiteboard={
                                            Venue.has_whiteboard as Boolean
                                        }
                                        has_projectors={
                                            Venue.has_projectors as Boolean
                                        }
                                        has_speakers={
                                            Venue.has_speakers as Boolean
                                        }
                                        has_air_conditioner={
                                            Venue.has_air_conditioner as Boolean
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

export default Venue;
