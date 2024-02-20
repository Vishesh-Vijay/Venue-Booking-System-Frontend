/* eslint-disable react/jsx-no-undef */
import { toast } from "sonner";

import React, { useState } from "react";
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
import { UpdateExistingBuilding,DeleteBuilding } from "@/utils/utils";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";

interface BuildingCardProps {
  name: string;
  id: string;
  resetBuilding: boolean;
  setResetBuilding: () => void;
}
const BuildingCard = ({
  name,
  id,
  resetBuilding,
  setResetBuilding,
}: BuildingCardProps) => {
  const [updateDialogueOpen, setUpdateDialogueOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState(name);
  const [updateBuildingLoading, setUpdateBuildingLoading] = useState(false);
  const [updateBuildingAlert, setUpdateBuildingAlert] = useState(false);
  const [isUpdateBuildingError, setIsUpdateBuildingError] = useState(false);
  const [updateBuildingError, setUpdateBuildingError] = useState("");

  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false);
   const [deleteBuildingLoading,setDeleteBuildingLoading] = useState(false);
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
        token as string
      ).then((res: any) => {
        const resp = res;
        if (resp.status == 200) { 
          console.log(resp)
          setUpdateBuildingLoading(false);
          setUpdateBuildingAlert(true);
          setNewBuilding("");
          setResetBuilding();
          toast("Building has been updated")

          setTimeout(() => {
            setUpdateBuildingAlert(false);
          }, 2000);
        }
      });
    } catch (error: any) {
      setIsUpdateBuildingError(true);
      setUpdateBuildingError(error.response.data.response_message);

      setTimeout(() => {
        setIsUpdateBuildingError(false);
        setUpdateBuildingError("");
      }, 3000);
    } finally {
      setUpdateBuildingLoading(false);
    }

  };
      const handleDeleteBuilding = async () => {
        setDeleteDialogueOpen(false);
        setDeleteBuildingLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response: any = DeleteBuilding(
            id,
            token as string
          ).then((res: any) => {
            const resp = res;
            if (resp.status == 200) {
              console.log(resp);
              setDeleteBuildingLoading(false);
              setDeleteBuildingAlert(true);
              // setNewBuilding("");
              toast("Building has been deleted", {
                style: {
                  backgroundColor: "#00fa9a",
                },
              });
              setResetBuilding();
              setTimeout(() => {
                setDeleteBuildingAlert(false);
              }, 2000);
            }
          });
        } catch (error: any) {
          setIsDeleteBuildingError(true);
          setDeleteBuildingError(error.response.data.response_message);
          setTimeout(() => {
            setIsDeleteBuildingError(false);
            setDeleteBuildingError("");
          }, 3000);
        } finally {
          setDeleteBuildingLoading(false);
        }
      };
  return (
    <>
      <Card className="w-full bg-[#313465] text-white">
        <Image
          src="/building.jpg"
          alt="building"
          width={400}
          height={400}
          className="w-full rounded-t-lg"
        />
        <div className="flex justify-between items-center w-full">
          <CardHeader>
            {updateBuildingLoading == false &&
            deleteBuildingLoading == false ? (
              <CardTitle>{name}</CardTitle>
            ) : (
              <CircularProgress />
            )}
            {updateBuildingAlert && !isUpdateBuildingError && (
              <Alert severity="success" className="mt-4 absolute right-1 top-8">
                Building Updated
              </Alert>
            )}
            {isUpdateBuildingError && (
              <Alert severity="error" className="absolute right-1 top-8">
                {updateBuildingError}
              </Alert>
            )}

            {deleteBuildingAlert && !isDeleteBuildingError && (
              <Alert severity="success" className="mt-4 absolute right-1 top-8">
                Building Deleted
              </Alert>
            )}
            {isDeleteBuildingError && (
              <Alert severity="error" className="absolute right-1 top-8">
                {deleteBuildingError}
              </Alert>
            )}
          </CardHeader>
          <div className=" flex justify-between items-center">
            <Dialog
              open={updateDialogueOpen}
              onOpenChange={setUpdateDialogueOpen}
            >
              <DialogTrigger>
                {" "}
                <HiOutlinePencil className="text-blue-500 w-5 h-5 mr-4" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Building</DialogTitle>
                  <DialogDescription>
                    Enter the name of the building you want to update to!
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
                    onClick={() => handleUpdateBuilding()}
                  >
                    Update
                  </Button>
                  <Button
                    type="reset"
                    onClick={() => {
                      setNewBuilding(name);
                      setUpdateDialogueOpen((val) => !val);
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
                  <DialogTitle>Delete Building</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to Delete this building?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-red-400"
                    onClick={() => handleDeleteBuilding()}
                  >
                    Delete
                  </Button>
                  <Button
                    type="reset"
                    onClick={() => {
                      setDeleteDialogueOpen((val) => !val);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </>
  );
};

export default BuildingCard;
