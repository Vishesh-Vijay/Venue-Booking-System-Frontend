'use client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
const HomePage = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
 
  return (
    show &&  
    (<div>
      <div>HomePage</div> 
    </div>)
  );
}

export default HomePage;