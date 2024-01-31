"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";

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
  const [showAlert, setShowAlert] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isError, setIsError] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error,setError] = useState("");
  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential: any = await signInWithPopup(auth, googleAuth);
      if (userCredential) {
        const user = userCredential.user;
        console.log(userCredential);
        try {
          const user_Data = {
            name: user.displayName    ,
            email: user.email,
            // profile_picture: user.photoURL,
            // uid: user.uid,
          };
          localStorage.setItem("token", userCredential._tokenResponse.idToken);
          localStorage.setItem("user", user.email);
          localStorage.setItem("name", user.displayName);
          localStorage.setItem("profile_picture", user.photoURL);
          
          const response: any = await loginUser(
            user_Data,
            userCredential._tokenResponse.idToken
          ).then(
            (res) => {
              const resp = res
              if(resp.status==200){
                  setLoading(false);
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                    router.replace("/");
                  }, 1000);
                }
              } 
          )
          

        } catch (error: any) {
          console.log(error.response.data.response_message);
          setIsError(true);
          setError(error.response.data.response_message);
          setTimeout(() => {
            setIsError(false);
            setError("");
          }, 3000);
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setError(error.response.data.response_message);
      setTimeout(() => {
        setIsError(false);
        setError("")

      },3000)
    }
  };
  return (
    <div className="bg-white flex flex-col justify-between items-center">
      <Image
        src="/login-vector.png"
        alt="login vector"
        width={300}
        height={300}
      />
      <h1 className="font-bold text-[#323263] text-3xl mt-5">LOGIN</h1>
      <Button
        className="bg-[#313465] flex items-center mt-6 px-3 py-2 text-white rounded-xl"
        startContent={<FcGoogle className="mr-1 mt-0.5" />}
        radius="md"
        onClick={handleLogin}
      >
        Login with Google
      </Button>
      {loading && <CircularProgress  className="mt-4" variant='indeterminate' color="primary" />}
      {showAlert && !isError && (
        <Alert severity="success" className="mt-4 absolute right-1 top-8">
          Login Successful
        </Alert>
      )}
      {
        isError && (
          <Alert severity="error" className="absolute right-1 top-8">
            {error}
          </Alert>
        )
      }
    </div>
  );
};

export default login;
