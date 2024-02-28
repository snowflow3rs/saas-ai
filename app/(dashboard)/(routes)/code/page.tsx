"use client";
import { Heading } from "@/components/heading";
import { Code, Divide, MessageSquare } from "lucide-react";
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
import Markdown from 'react-markdown'
import { openModal } from "@/app/redux/modalSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import toast from "react-hot-toast";
const CodePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [messages, setMessages] = useState<
    OpenAI.Chat.CreateChatCompletionRequestMessage[]
  >([]);

  const formSchema = z.object({
    prompt: z.string().min(2, {
      message: "Code Prompt is required",
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

      const response = await axios.post("/api/code", {
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
         title="Code Generation"
         description="Generate code using descriptive text."
         icon={Code}
         iconColor="text-green-700"
         bgColor="bg-green-700/10"
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
                        placeholder="Simple toggle button using react hooks."
                        {...field}
                        disabled={isLoading}
                        className="  border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
             <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
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
                  message.role === "user" ? "bg-white border border-black/10" : " bg-[#f1f5f9] ",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <Markdown components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black text-white p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }} className="text-sm overflow-hidden leading-7">
                  {message.content || ""}
                </Markdown>

                
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

export default CodePage;
