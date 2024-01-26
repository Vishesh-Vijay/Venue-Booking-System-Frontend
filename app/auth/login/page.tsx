"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";

import { userAgent } from "next/server";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { auth } from "../../firebase";
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
const login = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);
  const googleAuth =  new GoogleAuthProvider()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const handleLogin = async () => {
      setLoading(true)
      const userCredential:any = await signInWithPopup(auth,googleAuth)
      if(userCredential){
        console.log(userCredential)
        setLoading(false)
      } 
      const token = userCredential.user.accessToken
      const user = userCredential.user
      console.log(token,user)
  }
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
        startContent={<FcGoogle />}
        radius="md"
        onClick={handleLogin}
      >
        Login with Google
      </Button>
      {loading && (
        <Spinner color="primary" label="loading..." className="mt-4" />
      )}
    </div>
  );
};

export default login;
