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
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
const login = () => {
  const [loading, setLoading] = useState(false);
  const googleAuth = new GoogleAuthProvider();
  const router = useRouter();
  const longText = `Utilize the IIITA official email for logging in.
`;
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
          };
          localStorage.setItem("token", userCredential._tokenResponse.idToken);
          setTimeout(() => {
            localStorage.removeItem("token");
          }, 60 * 60 * 1000); // 1 hour in milliseconds
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
              toast("Login Successfull!", {
                style: {
                  backgroundColor: "#00fa9a",
                },
              });
              setTimeout(() => {
                router.replace("/");
              }, 1000);
            }
          });
        } catch (error: any) {
          toast(
            `${error.response?.data?.response_message || "An error occured"}`,
            {
              style: {
                backgroundColor: "red",
              },
            }
          );
          setLoading(false);
        }
        setLoading(false);
      }
    } catch (error: any) {
      toast(`${error.response?.data?.response_message || "An error occured"}`, {
        style: {
          backgroundColor: "red",
        },
      });
      setLoading(false);
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
      <Tooltip title={longText}>
        <Button
          className="bg-[#313465] flex items-center mt-6 px-8 py-3 text-white  shadow-md rounded-sm"
          startContent={<FcGoogle className="mr-1 mt-0.5" />}
          radius="md"
          onClick={handleLogin}
        >
          Login with Google
        </Button>
      </Tooltip>
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
