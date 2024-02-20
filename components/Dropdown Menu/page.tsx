"use client";
import React, { useEffect } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    User,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../app/firebase";
import { Alert, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/image";
const DropdownComponent = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [open, setOpen] = React.useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        setTimeout(() => {
            setShowAlert(true);
        }, 3000);
        signOut(auth)
            .then(() => {
                localStorage.removeItem("token");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    router.push("/auth/login"); // Redirect after logout
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                setIsError(true);
                setError(
                    error.response?.data?.response_message ||
                        "An error occurred"
                );
                setTimeout(() => {
                    setIsError(false);
                    setError("");
                }, 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const profile_picture = localStorage.getItem("profile_picture");
    return (
        <div className="flex items-center gap-4 cursor-pointer">
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    {profile_picture == "" ? (
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    ) : (
                        <Image
                            src={profile_picture as string}
                            alt="profile"
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                    )}
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    className="bg-[#313465] p-3 rounded-md text-white"
                >
                    {/* <DropdownItem key="settings" className="p-1">
            My Settings
          </DropdownItem> */}
                    {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
                    <DropdownItem
                        key="logout"
                        className="p-1"
                        color="danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            {loading && (
                <CircularProgress
                    variant="indeterminate"
                    color="primary"
                    className="mt-4 absolute top-40 right-40"
                />
            )}
            {showAlert && (
                <Alert severity="success" className="absolute right-1 top-8">
                    Logout Successful
                </Alert>
            )}
        </div>
    );
};
export default DropdownComponent;
