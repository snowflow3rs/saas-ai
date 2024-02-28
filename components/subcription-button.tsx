"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Zap } from 'lucide-react';
import axios from 'axios';
interface SubscriptionButtonProps{

    isPro:boolean
}
const SubscriptionButton = ({isPro=false}:SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);

    const onClick = async()=>{

        try {
            setLoading(true)
            const res = await axios.get("/api/stripe")

            window.location.href = res.data.url
        } catch (error) {
            console.log('BILLING_ERROR',error);
            
        } finally{

            setLoading(false)
    }
    }
  return (
    <Button variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick} >
    {isPro ? "Manage Subscription" : "Upgrade"}
    {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
  </Button>
  )
}

export default SubscriptionButton