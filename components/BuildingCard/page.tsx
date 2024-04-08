import React, { useState, ChangeEvent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import { toast } from "sonner";
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
import { UpdateExistingBuilding, DeleteBuilding } from "@/utils/utils";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";

interface BuildingCardProps {
    name: string;
    id: string;
    building_picture: string;
    resetBuilding?: boolean;
    setResetBuilding?: () => void;
    showIcons?: boolean;
    onSelect?: () => void;
    isSelected?: boolean; // New prop to indicate whether the card is selected
}

const BuildingCard = ({
    name,
    id,
    building_picture,
    resetBuilding,
    setResetBuilding,
    showIcons,
    onSelect,
    isSelected = false, // Default isSelected to false
}: BuildingCardProps) => {
    const [updateDialogueOpen, setUpdateDialogueOpen] = useState(false);
    const [newBuilding, setNewBuilding] = useState(name);
    const [buildingPicture, setBuildingPicture] = useState<File | null>(null);
    const [updateBuildingLoading, setUpdateBuildingLoading] = useState(false);
    const [updateBuildingAlert, setUpdateBuildingAlert] = useState(false);
    const [isUpdateBuildingError, setIsUpdateBuildingError] = useState(false);
    const [updateBuildingError, setUpdateBuildingError] = useState("");

    const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false);
    const [deleteBuildingLoading, setDeleteBuildingLoading] = useState(false);
    const [deleteBuildingAlert, setDeleteBuildingAlert] = useState(false);
    const [isDeleteBuildingError, setIsDeleteBuildingError] = useState(false);
    const [deleteBuildingError, setDeleteBuildingError] = useState("");

    const handleUpdateBuilding = async () => {
        setUpdateDialogueOpen(false);
        setUpdateBuildingLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = UpdateExistingBuilding(
                id,
                newBuilding,
                buildingPicture,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    console.log(resp);
                    setUpdateBuildingLoading(false);
                    toast("Building has been successfully updated", {
                        style: {
                            backgroundColor: "#00fa9a",
                        },
                    });
                    setNewBuilding("");
                    if (setResetBuilding) setResetBuilding();
                }
            });
        } catch (error: any) {
            toast(`${error.response.data.response_message}`, {
                style: {
                    backgroundColor: "red",
                },
            });
        } finally {
            setUpdateBuildingLoading(false);
        }
    };

    const handleDeleteBuilding = async () => {
        setDeleteDialogueOpen(false);
        setDeleteBuildingLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = DeleteBuilding(id, token as string).then(
                (res: any) => {
                    const resp = res;
                    if (resp.status == 200) {
                        console.log(resp);
                        setDeleteBuildingLoading(false);
                        toast("Building has been successfully Deleted", {
                            style: {
                                backgroundColor: "#00fa9a",
                            },
                        });
                        if (setResetBuilding) setResetBuilding();
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
            setDeleteBuildingLoading(false);
        }
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setBuildingPicture(file);
    };
    return (
        <>
            <Card
                className={`w-full h-full flex flex-col bg-[#313465] text-white ${
                    isSelected ? "border-4 border-green-500" : ""
                }`}
                onClick={onSelect}
            >
                <Image
                    src={building_picture ? building_picture : "/building.jpg"}
                    alt="building"
                    width={400}
                    height={400}
                    className="w-full rounded-t-lg flex-1"
                />
                <div className="flex flex-shrink justify-between items-center w-full">
                    <CardHeader>
                        {updateBuildingLoading === false &&
                        deleteBuildingLoading === false ? (
                            <CardTitle>{name}</CardTitle>
                        ) : (
                            <CircularProgress />
                        )}
                    </CardHeader>
                    {showIcons && (
                        <div className="flex items-center">
                            <Dialog
                                open={updateDialogueOpen}
                                onOpenChange={setUpdateDialogueOpen}
                            >
                                <DialogTrigger>
                                    <HiOutlinePencil className="text-blue-500 w-5 h-5 mr-4" />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Update Building
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter the name of the building you
                                            want to update to!
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
                                                    setNewBuilding(
                                                        e.target.value
                                                    );
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
                                            onClick={handleUpdateBuilding}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            type="reset"
                                            onClick={() => {
                                                setNewBuilding(name);
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
                                    <MdDeleteOutline className="text-red-500 w-5 h-5 mr-4" />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Delete Building
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to Delete this
                                            building?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="bg-red-400"
                                            onClick={handleDeleteBuilding}
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
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default BuildingCard;
