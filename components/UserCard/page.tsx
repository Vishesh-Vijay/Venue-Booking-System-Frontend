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
import { DeleteUser, UpdateExistingUser } from "@/utils/utils";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
interface UserCardProps {
    email: string;
    name: string;
    parent: string;
    require_parent_permission: Boolean;
    is_admin: Boolean;
    is_authority: Boolean;
    resetUser: boolean;
    setResetUser: () => void;
}
const UserCard = ({
    email,
    name,
    parent,
    require_parent_permission,
    is_admin,
    is_authority,
    resetUser,
    setResetUser,
}: UserCardProps) => {
    const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false),
        [updateDialogueOpen, setUpdateDialogueOpen] = useState(false),
        [updateUserLoading, setUpdateUserLoading] = useState(false),
        [deleteUserLoading, setDeleteUserLoading] = useState(false),
        [updateUserAlert, setUpdateUserAlert] = useState(false),
        [isUpdateUserError, setIsUpdateUserError] = useState(false),
        [deleteUserAlert, setDeleteUserAlert] = useState(false),
        [updateUserError, setUpdateUserError] = useState(false),
        [isDeleteUserError, setIsDeleteUserError] = useState(false),
        [deleteUserError, setDeleteUserError] = useState(""),
        [detailsDialogueOpen, setDetailsDialogueOpen] = useState(false);

    const [newEmail, setNewEmail] = useState(email),
        [newName, setNewName] = useState(name),
        [newParent, setNewParent] = useState(parent),
        [admin, setAdmin] = useState(String(is_admin)),
        [authority, setAuthority] = useState(String(is_authority)),
        [parentPermisssion, setParentPermission] = useState(
            String(require_parent_permission)
        );
    const handleUpdateUser = async () => {
        setUpdateDialogueOpen(false);
        setUpdateUserLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = UpdateExistingUser(
                newEmail,
                newName,
                newParent,
                parentPermisssion,
                admin,
                authority,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status === 200) {
                    console.log(resp);
                    setUpdateUserLoading(false);
                    setUpdateUserAlert(true);
                    setResetUser();
                    setTimeout(() => {
                        setUpdateUserAlert(false);
                    }, 2000);
                }
            });
        } catch (error: any) {
            toast(`${error.response.data.response_message}`, {
                style: {
                    backgroundColor: "red",
                },
            });
        } finally {
            setUpdateUserLoading(false);
        }
    };
    const handleDeleteUser = async () => {
        setDeleteDialogueOpen(false);
        setDeleteUserLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = DeleteUser(
                email as string,
                token as string
            ).then((res: any) => {
                const resp = res;
                if (resp.status == 200) {
                    console.log(resp);
                    setDeleteUserLoading(false);
                    setDeleteUserAlert(true);
                    setResetUser();
                    setTimeout(() => {
                        setDeleteUserAlert(false);
                    }, 2000);
                }
            });
        } catch (error: any) {
            setIsDeleteUserError(true);
            setDeleteUserError(error.response.data.response_message);
            setTimeout(() => {
                setIsDeleteUserError(false);
                setDeleteUserError("");
            }, 3000);
        } finally {
            setDeleteUserLoading(false);
        }
    };
    return (
        <>
            <Card className="w-full bg-[#313465] text-white h-40">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col justify-between items-start p-5">
                        <CardHeader className="p-0 mb-1">
                            {updateUserLoading == false &&
                            deleteUserLoading == false ? (
                                <CardTitle>{name}</CardTitle>
                            ) : (
                                <CircularProgress />
                            )}
                            {updateUserAlert && !isUpdateUserError && (
                                <Alert
                                    severity="success"
                                    className="mt-4 absolute right-1 top-8"
                                >
                                    User Updated
                                </Alert>
                            )}
                            {isUpdateUserError && (
                                <Alert
                                    severity="error"
                                    className="absolute right-1 top-8"
                                >
                                    {updateUserError}
                                </Alert>
                            )}

                            {deleteUserAlert && !isDeleteUserError && (
                                <Alert
                                    severity="success"
                                    className="mt-4 absolute right-1 top-8"
                                >
                                    User Deleted
                                </Alert>
                            )}
                            {isDeleteUserError && (
                                <Alert
                                    severity="error"
                                    className="absolute right-1 top-8"
                                >
                                    {deleteUserError}
                                </Alert>
                            )}
                        </CardHeader>
                        <CardDescription className="p-0 font-bold">
                            {email}
                        </CardDescription>
                        <CardDescription className="p-0 font-bold">
                            Role: {is_admin ? "Admin" : "User"}
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
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update User</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the User for the
                                        fields you want to update!
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="email"
                                            className="text-center"
                                        >
                                            Email:
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder="New Email"
                                            value={newEmail}
                                            className="col-span-3"
                                            onChange={(e) => {
                                                setNewEmail(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-center"
                                        >
                                            Name:
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="New Name"
                                            value={newName}
                                            className="col-span-3"
                                            onChange={(e) => {
                                                setNewName(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="parent"
                                            className="text-center"
                                        >
                                            Parent:
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="New Parent"
                                            value={newParent}
                                            className="col-span-3"
                                            onChange={(e) => {
                                                setNewParent(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="type"
                                            className="text-center"
                                        >
                                            Parent Permission?:
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
                                                    value={parentPermisssion}
                                                    onValueChange={
                                                        setParentPermission
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
                                            is Admin?:
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
                                                    value={admin}
                                                    onValueChange={setAdmin}
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
                                            is Authority?:
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
                                                    value={authority}
                                                    onValueChange={setAuthority}
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
                                        onClick={() => handleUpdateUser()}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        type="reset"
                                        onClick={() => {
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
                                    <DialogTitle>Delete User</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this
                                        User?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="bg-red-400"
                                        onClick={() => handleDeleteUser()}
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
                                        User Details
                                    </DialogTitle>
                                    <DialogDescription className="grid grid-cols-2 gap-x-3 gap-y-1">
                                        <h1>
                                            <span className="font-semibold">
                                                Email:
                                            </span>
                                            {email}
                                        </h1>
                                        <h1>
                                            <span className="font-semibold">
                                                Name:
                                            </span>{" "}
                                            {name}
                                        </h1>
                                        <h1>
                                            {" "}
                                            <span className="font-semibold">
                                                Parent:
                                            </span>{" "}
                                            {parent}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            <span className="font-semibold">
                                                Admin:
                                            </span>{" "}
                                            {is_admin == false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            <span className="font-semibold">
                                                Requires Parent Permission:
                                            </span>{" "}
                                            {require_parent_permission ==
                                            false ? (
                                                <RxCross2 className="text-red-500 w-5 h-5 mr-4" />
                                            ) : (
                                                <FaCheck className="text-green-500 w-5 h-5 mr-4" />
                                            )}{" "}
                                        </h1>
                                        <h1 className="flex justify-start items-center">
                                            {" "}
                                            <span className="font-semibold">
                                                Authority:
                                            </span>{" "}
                                            {is_authority == false ? (
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
export default UserCard;
