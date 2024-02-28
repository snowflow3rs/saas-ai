"use client";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import axios from "axios";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { openModal } from "@/app/redux/modalSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import toast from "react-hot-toast";

const ConversationPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  
  const [messages, setMessages] = useState<
    OpenAI.Chat.CreateChatCompletionRequestMessage[]
  >([]);

  const formSchema = z.object({
    prompt: z.string().min(2, {
      message: "Message Prompt is required",
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
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [ response.data, userMessage,...current]);

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
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="How do I calculate the radius of a circle?"
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
            {messages.length === 0 && !isLoading && (
              <Empty label="No conversation started." />
            )}
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-[#f1f5f9] ",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm"> {message.content}</p>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-[#f1f5f9] ">
              <Loader />
            </div>
          )}
        </div>
       
      </div>
    </div>
  );
};

export default ConversationPage;
