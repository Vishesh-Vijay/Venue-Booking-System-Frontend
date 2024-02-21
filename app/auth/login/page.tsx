"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";
import { userAgent } from "next/server";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Alert from "@mui/material/Alert";
import { loginUser } from "@/utils/utils";
import { CircularProgress } from "@mui/material";
const login = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(false);
    const googleAuth = new GoogleAuthProvider();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleLogin = async () => {
        setLoading(true);
        try {
            const userCredential: any = await signInWithPopup(auth, googleAuth);
            if (userCredential) {
                const user = userCredential.user;
                console.log(userCredential);
                try {
                    const user_Data = {
                        name: user.displayName,
                        email: user.email,
                        // profile_picture: user.photoURL,
                        // uid: user.uid,
                    };
                    localStorage.setItem(
                        "token",
                        userCredential._tokenResponse.idToken
                    );
                    localStorage.setItem("user", user.email);
                    localStorage.setItem("name", user.displayName);
                    localStorage.setItem("profile_picture", user.photoURL);

                    const response: any = await loginUser(
                        user_Data,
                        userCredential._tokenResponse.idToken
                    ).then((res: any) => {
                        const resp = res;
                        if (resp.status == 200) {
                            setLoading(false);
                            toast("Login Sucessfull!", {
                              style: {
                                backgroundColor: "#00fa9a",
                              },
                            });
                             setTimeout(() => {
                                // setShowAlert(false);
                                router.replace("/");
                            }, 1000);
                        }
                    });
                } catch (error: any) {
                   toast(
                     `${
                       error.response?.data?.response_message ||
                       "An error occured"
                     }`,
                     {
                       style: {
                         backgroundColor: "red",
                       },
                     }
                   );
                }
                setLoading(false);
            }
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
        }
    };
    return (
        <div className="bg-white flex flex-col justify-between items-center mb-4">
            <Image
                src="/login-vector.png"
                alt="login vector"
                width={300}
                height={300}
            />
            <h1 className="font-bold text-[#323263] text-3xl mt-5">LOGIN</h1>
            <Button
                className="bg-[#313465] flex items-center mt-6 px-5 py-3 text-white rounded-xl"
                startContent={<FcGoogle className="mr-1 mt-0.5" />}
                radius="md"
                onClick={handleLogin}
            >
                Login with Google
            </Button>
            {loading && (
                <CircularProgress
                    className="mt-4"
                    variant="indeterminate"
                    color="primary"
                />
            )}
        </div>
    );
};

export default login;
