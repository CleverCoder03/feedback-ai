"use client";

import MessageCard from "@/components/MessageCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, Loader2, RefreshCcw, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to set message");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Refreshed Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to load messages"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [setValue, session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to set message");
    }
  };

  if (!session || !session.user) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
             <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
    )
  }

  const { username } = session?.user as User;

  // Safe check for window object to avoid hydration errors
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.info("Link Copied to Clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] -z-10"></div>

      <div className="my-8 mx-auto p-6 md:p-8 max-w-6xl w-full relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    User Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Manage your settings and view your anonymous feedback.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-2 rounded-lg">
                 <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                  />
                  <span className={`text-sm font-medium ${acceptMessages ? "text-green-400" : "text-gray-400"}`}>
                    Accepting Messages
                  </span>
            </div>
        </div>

        {/* Copy Link Card */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-purple-400" /> 
            Your Public Link
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full">
                <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-3 px-4 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 opacity-100" // Added opacity-100 to fix disabled styling
                />
            </div>
            <Button onClick={copyToClipboard} className="w-full md:w-auto font-semibold bg-white text-black hover:bg-gray-200">
                <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Messages Header & Refresh */}
        <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
             <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
                disabled={isLoading}
                >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                )}
                Refresh
            </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-20 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
              <p className="text-gray-500 text-lg">No messages to display yet.</p>
              <p className="text-gray-600 text-sm mt-2">Share your link to start receiving feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;