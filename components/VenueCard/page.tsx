/* eslint-disable react/jsx-no-undef */

import React, { useEffect, useState } from "react";
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
import { Button } from "../ui/button";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
    getBuildingDetailsById,
    getAllBuildings,
    getUserDetailsByEmail,
    DeleteVenue,
    UpdateExistingVenue,
} from "@/utils/utils";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface Building {
    id: string;
    name: string;
}

interface VenueCardProps {
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
    resetVenue: boolean;
    setResetVenue: () => void;
}
const VenueCard = ({
    authority_id,
    building_id,
    floor_number,
    has_air_conditioner,
    has_speakers,
    has_projectors,
    has_whiteboard,
    is_accessible,
    id,
    name,
    seating_capacity,
    venue_type,
    resetVenue,
    setResetVenue,
}: VenueCardProps) => {
    const [authority, setAuthority] = useState(authority_id);
    const [detailsDialogueOpen, setDetailsDialogueOpen] = useState(false);
    const [building, setBuilding] = useState("");
    const [buildingLoading, setBuildingLoading] = useState(false);
    const [isBuildingError, setIsBuildingError] = useState(false);
    const [buildingError, setBuildingError] = useState("");
    const [updateDialogueOpen, setUpdateDialogueOpen] = useState(false);
    const [newVenue, setNewVenue] = useState(name);
    const [updateVenueLoading, setUpdateVenueLoading] = useState(false);
    const [updateVenueAlert, setUpdateVenueAlert] = useState(false);
    const [isUpdateVenueError, setIsUpdateVenueError] = useState(false);
    const [updateVenueError, setUpdateVenueError] = useState("");
    const [loading, setLoading] = React.useState(false);

    const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false);
    const [deleteVenueLoading, setDeleteVenueLoading] = useState(false);
    const [deleteVenueAlert, setDeleteVenueAlert] = useState(false);
    const [isDeleteVenueError, setIsDeleteVenueError] = useState(false);
    const [deleteVenueError, setDeleteVenueError] = useState("");

    const [buildings, setBuildings] = useState<Array<Building>>([]);
    const [floor, setFloor] = useState(String(floor_number));
    const [capacity, setCapacity] = useState(String(seating_capacity));
    const [venueType, setVenueType] = useState(venue_type);
    const [accessible, setAccesible] = useState(String(is_accessible));
    const [projectors, setProjectors] = useState(String(has_projectors));
    const [whiteboard, setWhiteboard] = useState(String(has_speakers));
    const [speakers, setSpeakers] = useState(String(has_speakers));
    const [airConditioner, setAirConditioner] = useState(
        String(has_air_conditioner)
    );

    useEffect(() => {
        const getBuilding = async () => {
            setBuildingLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response: any = await getBuildingDetailsById(
                    building_id as string,
                    token as string
                ).then((res: any) => {
                    const resp = res;
                    setBuilding(resp.data.response_data.name);
                });
            } catch (error: any) {
                setBuildingLoading(false);
                setIsBuildingError(true);
                setBuildingError(error.response.data.response_message);
            } finally {
                setBuildingLoading(false);
            }
        };
        getBuilding();
    }, [building_id]);
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

                        setBuildings(data);
                    }
                });
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getBuildings();
    }, []);
    const handleUpdateVenue = async () => {
        setUpdateDialogueOpen(false);
        setUpdateVenueLoading(true);
        try {
            const token = localStorage.getItem("token");
            const authority_email = localStorage.getItem("user");
            const build_id: string = buildings.find(
                (ele) => ele.name == building
            ).id;
            const response: any = UpdateExistingVenue(
                id,
                newVenue,
                authority,
                build_id,
                floor,
                capacity,
                venueType,
                accessible,
                projectors,
                whiteboard,
                speakers,
                airConditioner,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    console.log(resp);
                    setUpdateVenueLoading(false);
                    setUpdateVenueAlert(true);
                    setResetVenue();
                    setTimeout(() => {
                        setUpdateVenueAlert(false);
                    }, 2000);
                }
            });
        } catch (error: any) {
            setIsUpdateVenueError(true);
            setUpdateVenueError(error.response.data.response_message);
            setTimeout(() => {
                setIsUpdateVenueError(false);
                setUpdateVenueError("");
            }, 3000);
        } finally {
            setUpdateVenueLoading(false);
        }
    };
    const handleDeleteVenue = async () => {
        setDeleteDialogueOpen(false);
        setDeleteVenueLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = DeleteVenue(id, token as string).then(
                (res: any) => {
                    const resp = res;
                    if (resp.status == 200) {
                        console.log(resp);
                        setDeleteVenueLoading(false);
                        setDeleteVenueAlert(true);
                        setResetVenue();
                        setTimeout(() => {
                            setDeleteVenueAlert(false);
                        }, 2000);
                    }
                }
            );
        } catch (error: any) {
            setIsDeleteVenueError(true);
            setDeleteVenueError(error.response.data.response_message);
            setTimeout(() => {
                setIsDeleteVenueError(false);
                setDeleteVenueError("");
            }, 3000);
        } finally {
            setDeleteVenueLoading(false);
        }
    };
    return (
        <>
            <Card className="w-full bg-[#313465] text-white">
                <Image
                    src="/Building.jpg"
                    alt="Venue"
                    width={400}
                    height={400}
                    className="w-full rounded-t-lg"
                />
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col justify-between items-start p-5">
                        <CardHeader className="p-0 mb-1">
                            {updateVenueLoading == false &&
                            deleteVenueLoading == false ? (
                                <CardTitle>{name}</CardTitle>
                            ) : (
                                <CircularProgress />
                            )}
                            {updateVenueAlert && !isUpdateVenueError && (
                                <Alert
                                    severity="success"
                                    className="mt-4 absolute right-1 top-8"
                                >
                                    Venue Updated
                                </Alert>
                            )}
                            {isUpdateVenueError && (
                                <Alert
                                    severity="error"
                                    className="absolute right-1 top-8"
                                >
                                    {updateVenueError}
                                </Alert>
                            )}

                            {deleteVenueAlert && !isDeleteVenueError && (
                                <Alert
                                    severity="success"
                                    className="mt-4 absolute right-1 top-8"
                                >
                                    Venue Deleted
                                </Alert>
                            )}
                            {isDeleteVenueError && (
                                <Alert
                                    severity="error"
                                    className="absolute right-1 top-8"
                                >
                                    {deleteVenueError}
                                </Alert>
                            )}
                        </CardHeader>
                        <CardDescription className="p-0 font-bold">
                            {building}
                        </CardDescription>
                    </div>
                    <div className=" flex justify-between items-center">
                        <Dialog
                            open={updateDialogueOpen}
                            onOpenChange={setUpdateDialogueOpen}
                        >
                            <DialogTrigger>
                                {" "}
                                <HiOutlinePencil className="text-blue-500 w-5 h-5 mr-4" />
                            </DialogTrigger>
                            <DialogContent
                                style={{ maxHeight: "70vh", overflowY: "auto" }}
                            >
                                <DialogHeader>
                                    <DialogTitle>Update Venue</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the Venue for the
                                        fields you want to update!
                                    </DialogDescription>
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
                                                                <div
                                                                    key={index}
                                                                >
                                                                    <DropdownMenuRadioItem
                                                                        value={
                                                                            build.name
                                                                        }
                                                                    >
                                                                        {
                                                                            build.name
                                                                        }
                                                                    </DropdownMenuRadioItem>
                                                                    ;
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <span>
                                                            No buildings yet!
                                                            Create one first
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
                                            Is Accessible?:
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
                                            Has Air Conditioner?:
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
                                            Has Projectors?:
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
                                                    onValueChange={
                                                        setProjectors
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
                                            Has White Board?:
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
                                                    onValueChange={
                                                        setWhiteboard
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
                                            Has Speakers?:
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
                                        className="bg-green-400"
                                        onClick={() => handleUpdateVenue()}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        type="reset"
                                        onClick={() => {
                                            setNewVenue(name);
                                            setUpdateDialogueOpen(
                                                (val) => !val
                                            );
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog
                            open={deleteDialogueOpen}
                            onOpenChange={setDeleteDialogueOpen}
                        >
                            <DialogTrigger>
                                {" "}
                                <MdDeleteOutline className="text-red-500 w-5 h-5 mr-4" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Venue</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this
                                        Venue?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="bg-red-400"
                                        onClick={() => handleDeleteVenue()}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        type="reset"
                                        onClick={() => {
                                            setDeleteDialogueOpen(
                                                (val) => !val
                                            );
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog
                            open={detailsDialogueOpen}
                            onOpenChange={setDetailsDialogueOpen}
                        >
                            <DialogTrigger>
                                {" "}
                                <IoIosInformationCircleOutline className="text-green-500 w-5 h-5 mr-4" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-center mb-4">
                                        Venue Details
                                    </DialogTitle>
                                    <DialogDescription className="grid grid-cols-2 gap-x-3 gap-y-1">
                                        <h1>
                                            <span className="font-semibold">
                                                Building:
                                            </span>
                                            {building}
                                        </h1>
                                        <h1>
                                            <span className="font-semibold">
                                                Type:
                                            </span>{" "}
                                            {venue_type}
                                        </h1>
                                        <h1>
                                            {" "}
                                            <span className="font-semibold">
                                                Floor:
                                            </span>{" "}
                                            {String(floor_number)}
                                        </h1>
                                        <h1>
                                            {" "}
                                            <span className="font-semibold">
                                                Authority:
                                            </span>{" "}
                                            {authority}
                                        </h1>
                                        <h1>
                                            {" "}
                                            <span className="font-semibold">
                                                Capacity:
                                            </span>{" "}
                                            {String(seating_capacity)}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            <span className="font-semibold">
                                                Accessible:
                                            </span>{" "}
                                            {is_accessible == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            <span className="font-semibold">
                                                White Board:
                                            </span>{" "}
                                            {has_whiteboard == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            {" "}
                                            <span className="font-semibold">
                                                Speakers:
                                            </span>{" "}
                                            {has_speakers == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            {" "}
                                            <span className="font-semibold">
                                                Air Conditioner:
                                            </span>{" "}
                                            {has_air_conditioner == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            {" "}
                                            <span className="font-semibold">
                                                Projector:
                                            </span>{" "}
                                            {has_projectors == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default VenueCard;
