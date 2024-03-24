/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [addBuildingLoading, setAddBuildingLoading] = React.useState(false);
    const [addBuildingAlert, setAddBuildingAlert] = useState(false);
    const [isNewBuildingError, setIsNewBuildingError] = React.useState(false);
    const [newBuildingError, setNewBuildingError] = React.useState("");
    const [open, setOpen] = useState(false);
    const [resetBuildings, setResetBuildings] = useState(false);
    const handleCreateBuilding = async () => {
        setOpen(false);
        setAddBuildingLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = addNewBuilding(
                newBuilding,
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
    // console.log(buildings);
    return (
        <div className="p-4">
            <h1 className="text-center mt-4 font-semibold text-4xl">
                Buildings
            </h1>
            <div className="w-full flex justify-center mt-6">
                <Dialog open={open} onOpenChange={setOpen}>
                    {addBuildingLoading == true ? (
                        <CircularProgress />
                    ) : (
                        <DialogTrigger>
                            <Button className="bg-green-400 flex items-center justify-center">
                                <IoAddCircleOutline className="mr-1 w-4 h-4 mt-0.5" />
                                <span>Add New Building</span>
                            </Button>
                        </DialogTrigger>
                    )}
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Building</DialogTitle>
                            <DialogDescription>
                                Enter the name of the building you want to add!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-center">
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
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-green-400"
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
            {loading == false ? (
                <ScrollArea className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                        {buildings.length > 0 ? (
                            buildings.map((building, index) => (
                                <div
                                    key={index}
                                    className="mt-2 flex flex-col justify-center items-center"
                                >
                                    <BuildingCard
                                        name={building.name as string}
                                        id={building.id as string}
                                        resetBuilding={resetBuildings}
                                        setResetBuilding={() =>
                                            setResetBuildings((val) => !val)
                                        }
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
