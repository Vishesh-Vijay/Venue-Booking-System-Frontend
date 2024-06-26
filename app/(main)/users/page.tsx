/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import {
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";
import { getAllUsers, addNewUser } from "@/utils/utils";
import UserCard from "@/components/UserCard/page";
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
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
interface User {
    email: string;
    name: string;
    parent: string;
    require_parent_permission: Boolean;
    is_admin: Boolean;
    is_authority: Boolean;
}
const Users = () => {
    const router = useRouter();
    if (localStorage.getItem("admin") == "no") {
        router.push("/");
        return null;
    }
    const [users, setUsers] = useState<Array<User>>([]);
    const [loading, setLoading] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [addUserLoading, setAddUserLoading] = React.useState(false);
    const [resetUsers, setResetUsers] = useState(false);
    const [newUserError, setNewUserError] = useState("");
    const [isNewUserError, setIsNewUserError] = useState(false);
    const [addUserAlert, setAddUserAlert] = useState(false);
    const [newUser, setNewUser] = useState("");

    const [filteredUsers, setFilteredUsers] = useState<Array<User>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [parent, setParent] = useState("");
    const [parentPermission, setParentPermission] = useState("false");
    const [isAdmin, setIsAdmin] = useState("false");
    const [isAuthority, setIsAuthority] = useState("false");

    const handleCreateUser = async () => {
        setOpen(false);
        setAddUserLoading(true);
        try {
            const token = localStorage.getItem("token");
            const props = {
                email: mail,
                name: name,
                parent: parent,
                require_parent_permission:
                    parentPermission === "true" ? true : false,
                is_admin: isAdmin === "true" ? true : false,
                is_authority: isAuthority === "true" ? true : false,
            };
            const response: any = addNewUser(props, token as string).then(
                (res: any) => {
                    if (res.status == 200) {
                        setAddUserLoading(false);
                        toast("User Added Sucessfully!", {
                            style: {
                                backgroundColor: "#00fa9a",
                            },
                        });
                        setNewUser("");
                        setResetUsers((val) => !val);
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
            setAddUserLoading(false);
        }
    };
    const getUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const userDetails: any = await getAllUsers(token as string).then(
                (res: any) => {
                    const resp: any = res;
                    if (resp.status == 200) {
                        const data = resp.data.response_data;
                        console.log(data);
                        setUsers(data);
                        setLoading(false);
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 1000);
                    }
                }
            );
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

    const filterUsers = () => {
        let filtered = users;

        // Filter based on search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter based on role
        if (roleFilter !== "all") {
            filtered = filtered.filter(
                (user) => user.is_admin === (roleFilter === "admin")
            );
        }

        setFilteredUsers(filtered);
    };
    const handleRoleFilterChange = (event: any) => {
        setRoleFilter(event.target.value);
    };
    useEffect(() => {
        getUsers();
    }, [resetUsers]);
    useEffect(() => {
        filterUsers(); // Update filtered users whenever search query or role filter changes
    }, [searchQuery, roleFilter, users]);
    return (
        <>
            <div className="p-4">
                <div className="flex gap-5 items-center mt-4 px-6">
                    <h1 className="  font-semibold text-4xl">Users</h1>
                    <div className="">
                        <Dialog open={open} onOpenChange={setOpen}>
                            {addUserLoading == true ? (
                                <CircularProgress />
                            ) : (
                                <DialogTrigger>
                                    <Button className="bg-[#598dcd] flex items-center justify-center rounded-3xl">
                                        <span>Add User</span>
                                        <IoAddCircleOutline className="ml-4 w-5 h-5 mt-0.5" />
                                    </Button>
                                </DialogTrigger>
                            )}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="mail"
                                            className="text-center"
                                        >
                                            Email:
                                        </Label>
                                        <Input
                                            id="mail"
                                            placeholder="Email ID"
                                            className="col-span-3"
                                            value={mail}
                                            onChange={(e) =>
                                                setMail(e.target.value)
                                            }
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
                                            id="mail"
                                            placeholder="Full Name"
                                            className="col-span-3"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="parent"
                                            className="text-center"
                                        >
                                            Parent Authority Email:
                                        </Label>
                                        <Input
                                            id="parent"
                                            placeholder="Parent Authority Email"
                                            className="col-span-3"
                                            value={parent}
                                            onChange={(e) =>
                                                setParent(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="parentPermission"
                                            className="text-center"
                                        >
                                            Parent Permission:
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
                                                    value={parentPermission}
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
                                            htmlFor="admin"
                                            className="text-center"
                                        >
                                            is Admin ?
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
                                                    value={isAdmin}
                                                    onValueChange={setIsAdmin}
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
                                            htmlFor="authority"
                                            className="text-center"
                                        >
                                            is Authority ?
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
                                                    value={isAuthority}
                                                    onValueChange={
                                                        setIsAuthority
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
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="bg-[#598dcd]"
                                        onClick={() => handleCreateUser()}
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        type="reset"
                                        onClick={() => {
                                            setNewUser("");
                                            setMail("");
                                            setName("");
                                            setParent("");
                                            setIsAdmin("false");
                                            setIsAuthority("false");
                                            setParentPermission("false");
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
                            label="Search User"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-1/4">
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="role-filter-label">Role</InputLabel>
                            <Select
                                labelId="role-filter-label"
                                id="role-filter"
                                value={roleFilter}
                                onChange={handleRoleFilterChange}
                                label="Role"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {loading == false ? (
                    <ScrollArea className="h-[550px] mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-2 px-6">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((User, index) => (
                                    <div
                                        key={index}
                                        className="mt-2 flex flex-col justify-center items-center"
                                    >
                                        <UserCard
                                            email={User.email as string}
                                            name={User.name as string}
                                            parent={User.parent as string}
                                            require_parent_permission={
                                                User.require_parent_permission as Boolean
                                            }
                                            is_admin={User.is_admin as Boolean}
                                            is_authority={
                                                User.is_authority as Boolean
                                            }
                                            resetUser={resetUsers}
                                            setResetUser={() =>
                                                setResetUsers((val) => !val)
                                            }
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full mt-12 text-center font-bold text-2xl">
                                    No Users found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                ) : (
                    <CircularProgress />
                )}
            </div>
        </>
    );
};
export default Users;
