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
        <div className="p-4">
            <h1 className="font-semibold text-center text-4xl mt-3">
                Your Profile
            </h1>
            <div className="flex justify-center items-center mt-6">
                {loading === false ? (
                    <Card className="w-full md:w-1/2 p-4">
                        <div className="flex items-center justify-center">
                            <Image
                                src={profilePicture}
                                alt="profilePicture"
                                width={100}
                                height={100}
                                className="w-1/4 rounded-full"
                            />
                        </div>
                        <div className="flex flex-col items-center mt-6 space-y-4">
                            <CardContent className="mt-6 space-y-4">
                                <h1>
                                    <span className="font-semibold">
                                        Name:{" "}
                                    </span>
                                    {userName}
                                </h1>
                                <h1>
                                    <span className="font-semibold">
                                        Email:{" "}
                                    </span>
                                    {email}
                                </h1>
                                <h1>
                                    <span className="font-semibold">
                                        Role:{" "}
                                    </span>
                                    {isAdmin == true ? "Admin" : "User"}
                                </h1>
                                <h1>
                                    <span className="font-semibold">
                                        Parent Authority:{" "}
                                    </span>
                                    {parentAuthority}
                                </h1>
                            </CardContent>
                        </div>
                    </Card>
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
