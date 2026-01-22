"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { MessageSquare, Trash2, X } from "lucide-react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id.toString());
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  // Format date nicely
  const formattedDate = new Date(message.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Card className="bg-gray-900/40 backdrop-blur-md border border-gray-800 hover:border-gray-700 hover:bg-gray-900/60 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden">
      
      {/* Decorative gradient header line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 rounded-full">
                <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Anonymous</span>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 -mt-2 -mr-2 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Delete Message"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>

          {/* Alert Dialog Content - Styled for Dark Mode */}
          <AlertDialogContent className="bg-gray-950 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete this message?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete this
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <p className="text-lg text-gray-100 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-gray-500 font-mono">
            {formattedDate}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;