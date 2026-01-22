"use client"
import * as React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // For loading spinner
import { useParams } from 'next/navigation';

export default function PublicProfile() {
  // State for the message textarea
  const [message, setMessage] = useState("");
  
  // State for the three suggested messages
  const [suggestions, setSuggestions] = useState<string[]>([
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?"
  ]);
  
  // Loading states
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Success/Error messages
  const [statusMessage, setStatusMessage] = useState("");

  // Get username from URL params (e.g., /u/john)
  const { username } = useParams<{ username: string }>();
  // const username = React.use(params);

  /**
   * Function to regenerate suggestions
   * Calls the suggest-messages API and updates the suggestions
   */
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setStatusMessage("");
    
    try {
      // Call the suggest-messages API
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      // The API returns a stream, so we need to read it
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      // Read the stream chunk by chunk
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      // Split the response by || to get individual suggestions
      const newSuggestions = fullText
        .split('||')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Update suggestions if we got valid results
      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
      }
      
    } catch (error) {
      console.error('Error regenerating suggestions:', error);
      setStatusMessage("Failed to regenerate suggestions. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  /**
   * Function to send the message
   * Calls the send-message API with username and content
   */
  const handleSendMessage = async () => {
    // Validation: Check if message is not empty
    if (!message.trim()) {
      setStatusMessage("Please write a message before sending.");
      return;
    }

    setIsSending(true);
    setStatusMessage("");

    try {
      // Call the send-message API
      const response = await fetch('/api/send-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          content: message,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (data.success) {
        // Success! Clear the message and show success message
        setMessage("");
        setStatusMessage("Message sent successfully! 🎉");
        
        // Clear success message after 3 seconds
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        // Handle error from API
        setStatusMessage(data.message || "Failed to send message.");
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage("An error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-12 text-slate-900">Public Profile Link</h1>

      <div className="w-full max-w-2xl space-y-8">
        
        {/* Input Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">
            Send Anonymous Message to @{username}
          </label>
          <Textarea 
            placeholder="Write your message here..." 
            className="min-h-[120px] resize-none border-slate-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          
          {/* Status Message */}
          {statusMessage && (
            <p className={`text-sm text-center ${
              statusMessage.includes('successfully') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {statusMessage}
            </p>
          )}
          
          <div className="flex justify-center">
            <Button 
              className="bg-slate-950 hover:bg-slate-600 px-8 py-2 rounded-md"
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send It'
              )}
            </Button>
          </div>
        </div>

        <div className="text-sm text-slate-600 text-center">
          Click on any message below to select it.
        </div>

        {/* Suggestions Card */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Messages</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((text, index) => (
              <button
                key={index}
                onClick={() => setMessage(text)}
                className="w-full p-4 text-left border border-slate-100 rounded-md hover:bg-slate-50 transition-colors text-slate-800 text-sm"
                disabled={isRegenerating || isSending}
              >
                {text}
              </button>
            ))}
          </CardContent>
        </Card>

        <hr className="my-8 border-slate-100" />

        {/* Footer Action */}
        <div className="text-center space-y-4">
          <p className="text-sm font-medium text-slate-800">Get Your Message Board</p>
          <Button className="bg-slate-950 text-white hover:bg-slate-800 px-6 py-6 text-md rounded-lg">
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
}