'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { FcGoogle } from "react-icons/fc";
import { Button } from '@nextui-org/react'
import { useUserAuth } from '@/app/context/AuthContext'; 
import { userAgent } from 'next/server';
import {Spinner} from '@nextui-org/react'
import { useRouter } from "next/navigation";

const login = () => {
// eslint-disable-next-line react-hooks/rules-of-hooks
const { googleSignIn, user, logOut }:any = useUserAuth();
// eslint-disable-next-line react-hooks/rules-of-hooks
const [loading, setLoading] = useState(false)
// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter()
    const handleSignIn = async()=>{
        try{
            //set loading untill its done
            setLoading(true)
            await googleSignIn()
            if(user){
                setLoading(false)
                router.push('/')
            }
            
            
        }catch(err){
            console.log(err)
        }
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
        className="bg-[#313465] flex items-center mt-6 text-white"
        startContent={<FcGoogle />}
        radius="md"
        onClick={handleSignIn}
      >
        Login with Google
      </Button>
        {loading && <Spinner color='primary' label='loading...' className='mt-4' />}
    </div>
  );
}

export default login