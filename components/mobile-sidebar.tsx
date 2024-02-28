"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import SideBar from './sidebar'

interface MobileSidebarProps{
  apiLimitCount: number;
  isPro:boolean
    }
const MobileSidebar= ({apiLimitCount,
  isPro=false}:MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (

    <Sheet>
      <SheetTrigger>

           <Button variant="ghost" size="icon" className='md:hidden'><Menu/></Button>  
      </SheetTrigger>
      <SheetContent side="left" className='p-0'>

      
          <SideBar isPro={isPro} apiLimitCount={apiLimitCount}/>
         </SheetContent>

    </Sheet>
  )
}

export default MobileSidebar