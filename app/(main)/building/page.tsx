/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { CircularProgress, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import BuildingCard from "@/components/BuildingCard/page";
import { addNewBuilding, getAllBuildings } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
interface Building {
    id: string;
    name: string;
    building_picture: string;
}
const Building = () => {
    const router = useRouter();
    if (localStorage.getItem("admin") == "no") {
        router.push("/");
        return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [buildings, setBuildings] = useState<Array<Building>>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showAlert, setShowAlert] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isError, setIsError] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [newBuilding, setNewBuilding] = useState("");
    const [buildingPicture, setBuildingPicture] = useState<File | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [addBuildingLoading, setAddBuildingLoading] = React.useState(false);
    const [addBuildingAlert, setAddBuildingAlert] = useState(false);
    const [isNewBuildingError, setIsNewBuildingError] = React.useState(false);
    const [newBuildingError, setNewBuildingError] = React.useState("");
    const [open, setOpen] = useState(false);
    const [resetBuildings, setResetBuildings] = useState(false);

    const [filteredBuildings, setFilteredBuildings] = useState<Array<Building>>(
        []
    );

    const [searchQuery, setSearchQuery] = useState("");

    const handleCreateBuilding = async () => {
        setOpen(false);
        setAddBuildingLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = addNewBuilding(
                newBuilding,
                buildingPicture,
                token as string
            ).then((res: any) => {
                if (res.status == 200) {
                    setAddBuildingLoading(false);
                    toast("Building Added Sucessfully!", {
                        style: {
                            backgroundColor: "#00fa9a",
                        },
                    });
                    setNewBuilding("");
                    setResetBuildings((val) => !val);
                }
            });
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
            setAddBuildingLoading(false);
        }
    };
    const filterBuildings = () => {
        let filtered = buildings;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((building) =>
                building.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBuildings(filtered);
    };
    useEffect(() => {
        const getBuildings = async () => {
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
        getBuildings();
    }, [resetBuildings]);
    useEffect(() => {
        filterBuildings();
    }, [searchQuery, buildings]);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setBuildingPicture(file);
    };
    return (
        <div className="p-4">
            <div className="flex gap-5 items-center mt-4 px-6">
                <h1 className="font-semibold text-4xl">Buildings</h1>
                <div className="">
                    <Dialog open={open} onOpenChange={setOpen}>
                        {addBuildingLoading == true ? (
                            <CircularProgress />
                        ) : (
                            <DialogTrigger>
                                <Button className="bg-[#598dcd] flex items-center justify-center rounded-3xl">
                                    <span>Add Building</span>
                                    <IoAddCircleOutline className="ml-4 w-5 h-5 mt-0.5" />
                                </Button>
                            </DialogTrigger>
                        )}
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Building</DialogTitle>
                                <DialogDescription>
                                    Enter the name of the building you want to
                                    add!
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
                                        placeholder="New Building"
                                        value={newBuilding}
                                        className="col-span-3"
                                        onChange={(e) => {
                                            setNewBuilding(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="building_picture"
                                        className="text-center"
                                    >
                                        Building Picture:
                                    </Label>
                                    <Input
                                        id="building_picture"
                                        type="file"
                                        className="col-span-3"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="bg-[#598dcd]"
                                    onClick={() => handleCreateBuilding()}
                                >
                                    Create
                                </Button>
                                <Button
                                    type="reset"
                                    onClick={() => {
                                        setNewBuilding("");
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
                        label="Search Building"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {loading == false ? (
                <ScrollArea className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                        {filteredBuildings.length > 0 ? (
                            filteredBuildings.map((building, index) => (
                                <div
                                    key={index}
                                    className="mt-2 flex flex-col justify-center items-center"
                                >
                                    <BuildingCard
                                        name={building.name as string}
                                        id={building.id as string}
                                        building_picture={
                                            building.building_picture as string
                                        }
                                        resetBuilding={resetBuildings}
                                        setResetBuilding={() =>
                                            setResetBuildings((val) => !val)
                                        }
                                        showIcons={true}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full mt-12 text-center font-bold text-2xl">
                                No Buildings found!!
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

export default Building;
