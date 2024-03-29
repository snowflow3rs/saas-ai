import React from 'react'

import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import { apiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

const Navbar = async() => {
  const getApiLimitCount = await apiLimitCount()
  const isPro = await checkSubscription()

  return (
    <div className=' flex items-center p-4'>
        <MobileSidebar isPro={isPro} apiLimitCount ={getApiLimitCount}/>
        <div className='flex w-full justify-end'><UserButton afterSignOutUrl='/'/></div>
      </div>
  )
}

export default Navbar