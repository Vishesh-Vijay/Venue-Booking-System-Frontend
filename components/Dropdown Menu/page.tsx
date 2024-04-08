import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../app/firebase";
import { toast } from "sonner";
import Image from "next/image";
import { LuLogOut } from "react-icons/lu";
import {
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
const DropdownComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        setLoading(true);
        setOpenDialog(false); // Close the dialog

        signOut(auth)
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("admin");
                localStorage.removeItem("authority");
                localStorage.removeItem("name");
                localStorage.removeItem("profile_picture");

                toast("Logout Successful!", {
                    style: {
                        backgroundColor: "#00fa9a",
                    },
                });

                setTimeout(() => {
                    router.push("/auth/login");
                }, 1000);
            })
            .catch((error) => {
                toast(
                    `${
                        error.response?.data?.response_message ||
                        "An error occurred"
                    }`,
                    {
                        style: {
                            backgroundColor: "red",
                        },
                    }
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleProfile = () => {
        router.push("/profile");
    };

    const profile_picture = localStorage.getItem("profile_picture");

    return (
        <div className="flex items-center gap-4 cursor-pointer">
            {profile_picture && (
                <div onClick={handleProfile}>
                    <Image
                        src={profile_picture}
                        alt="profile"
                        width={45}
                        height={45}
                        className="rounded-full"
                    />
                </div>
            )}
            <div onClick={() => setOpenDialog(true)}>
                <LuLogOut
                    className="mr-1 mt-0.5"
                    size={24}
                    style={{ color: "black" }}
                />
            </div>

            {loading && (
                <CircularProgress
                    variant="indeterminate"
                    color="primary"
                    className="mt-4 absolute top-40 right-40"
                />
            )}

            {/* Dialog for logout confirmation */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <Alert severity="warning">
                        Are you sure you want to logout?
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleLogout} variant="contained">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DropdownComponent;
