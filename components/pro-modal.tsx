"use client"
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { closeModal } from "@/app/redux/modalSlice";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { tools } from "@/constants";
import axios from "axios";




const ProModal = () => {
 

const isOpen = useAppSelector((state)=>state.proModal.isOpen)
const dispatch = useAppDispatch()
const [loading, setLoading] = useState(false);
 const handleOnChange = ()=>{
  dispatch(closeModal())
 }
const onSubscribe = async()=>{

  try {
    setLoading(true)
    const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
  } catch (error) {
    console.log("STRIPE_CLIENT_ERROR: " + error);
    
  }finally{

    setLoading(false)
  }
}

  return (
  
    <Dialog open={isOpen} onOpenChange={handleOnChange} >
       <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl">
              Upgrade to Genius
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">
                    {tool.label}
                  </div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
           disabled={loading} onClick={onSubscribe}
            size="lg" variant="premium" className="w-full">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
