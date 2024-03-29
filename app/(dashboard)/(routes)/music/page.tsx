"use client";
import { Heading } from "@/components/heading";
import { MessageSquare, Music } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { openModal } from "@/app/redux/modalSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import toast from "react-hot-toast";
const MusicPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [musics, setMusics] = useState<string >();

  const formSchema = z.object({
    prompt: z.string().min(2, {
      message: "Music Prompt is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusics(undefined)

      const response = await axios.post("/api/music", values)
      console.log(response)
    setMusics(response.data)

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        dispatch(openModal())
      
      }else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div >
      <Heading
       title="Music Generation"
       description="Turn your prompt into music."
       icon={Music}
       iconColor="text-emerald-500"
       bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
      <div >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                p-4 
                px-3 
                w-full
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2 
             
               
              "
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        placeholder="Piano solo!"
                        {...field}
                        disabled={isLoading}
                        className="  border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                size="icon"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          
          <div className="flex flex-col-reverse gap-y-4">
            {!musics&& !isLoading && (
              <Empty label="No video started." />
            )}

          </div>
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-[#f1f5f9] ">
              <Loader />
            </div>
          )}
         {musics   && (
          <audio controls className="w-full mt-8">
            <source src={musics} />
          </audio>
        )}
        </div>
       
      </div>
    </div>
  );
};

export default MusicPage;
