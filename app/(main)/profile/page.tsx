"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { getUserDetailsByEmail } from "@/utils/utils";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

const Profile = () => {
    const [userName, setUserName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>(
        localStorage.getItem("user") as string
    );
    const [loading, setLoading] = React.useState(false);
    const [profilePicture, setProfilePicture] = React.useState<string>(
        localStorage.getItem("profile_picture") as string
    );
    const [parentAuthority, setParentAuthority] = React.useState("");
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const getUserDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const userDetails: any = await getUserDetailsByEmail(
                    email,
                    token as string
                ).then((res: any) => {
                    const resp = res;
                    if (resp.status == 200) {
                        const data = resp.data.response_data;
                        setUserName(data.name);
                        setParentAuthority(data.parent);
                        if (data.is_admin) {
                            setIsAdmin(true);
                        }
                        setLoading(false);
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 1000);
                    }
                });
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
        getUserDetails();
    }, [email]);

    return (
        <div className="">
            <div className="relative">
                <div className="w-full h-40 bg-[#598dcd] rounded-br-lg"></div>
                <div className="absolute  bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <Image
                        src={profilePicture}
                        alt="profilePicture"
                        width={150}
                        height={150}
                        className="rounded-lg"
                    />
                </div>
            </div>
            <div className="flex justify-center flex-col m-24  ">
                {loading === false ? (
                    <>
                        <div className="flex items-center flex-col gap-2">
                            <div className="text-3xl font-semibold">
                                {userName}
                            </div>
                            <div className="text-md font-regular">{email}</div>
                        </div>
                        <div className="flex justify-self-start flex-col gap-4 mt-8">
                            <div className="flex items-center gap-10">
                                <div className="text-xl font-medium">Role</div>
                                <div>
                                    <Chip
                                        label={isAdmin ? "Admin" : "User"}
                                        size="medium"
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="text-xl font-medium">
                                    Parent Authority
                                </div>
                                <div>
                                    <Chip
                                        label={parentAuthority}
                                        size="medium"
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <CircularProgress />
                )}
                {isError && (
                    <Alert severity="error" className="absolute right-1 top-8">
                        {error}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default Profile;
