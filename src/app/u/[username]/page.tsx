"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Sparkles } from "lucide-react"; 
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

export default function PublicProfile() {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?"
  ]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      const newSuggestions = fullText
        .split('||')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
        toast.success("Suggestions refreshed!");
      }
    } catch (error) {
      console.error('Error regenerating suggestions:', error);
      toast.error("Failed to regenerate suggestions.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/send-messages', { // Fixed endpoint to singular based on typical convention, check your API route name
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content: message }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("");
        toast.success("Message sent successfully! 🎉");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
      setMessage(text);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
        
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <main className="w-full max-w-3xl space-y-8 z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Public Profile
            </h1>
            <p className="text-gray-400 text-lg">
                Send an anonymous message to <span className="text-purple-400 font-semibold">@{username}</span>
            </p>
        </div>

        {/* Input Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
             <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-400" />
                    Write your message
                </label>
                <Textarea 
                    placeholder="Type your secret message here..." 
                    className="min-h-[150px] resize-none bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl p-4 text-base"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                />
                
                <div className="flex justify-end">
                    <Button 
                        className={`px-8 py-6 rounded-xl font-bold transition-all duration-300 ${isSending ? 'bg-gray-700' : 'bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-lg shadow-white/10'}`}
                        onClick={handleSendMessage}
                        disabled={isSending || !message.trim()}
                    >
                        {isSending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                        </>
                        ) : (
                        <>
                            Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                        )}
                    </Button>
                </div>
             </div>
        </div>

        {/* Suggestions Section */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                 <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" /> 
                        AI Suggestions
                    </h3>
                    <p className="text-sm text-gray-500">Click any card to use it</p>
                 </div>
                 
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshIcon />}
                    <span className="ml-2 hidden sm:inline">Get New Ideas</span>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                {suggestions.map((text, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(text)}
                        disabled={isRegenerating || isSending}
                        className="group text-left p-5 bg-gray-900/40 border border-gray-800 rounded-xl hover:bg-gray-800/60 hover:border-purple-500/50 transition-all duration-200 active:scale-[0.99]"
                    >
                        <p className="text-gray-300 group-hover:text-white transition-colors">
                            {text}
                        </p>
                    </button>
                ))}
            </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-12 pb-8 text-center space-y-4">
             <div className="inline-block w-full max-w-sm h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
             <p className="text-gray-400">Want to receive anonymous messages too?</p>
             <Link href="/sign-up">
                <Button variant="secondary" className="font-semibold rounded-full px-8">
                    Create Your Own Board
                </Button>
             </Link>
        </div>

      </main>
    </div>
  );
}

// Small helper component for the refresh icon
function RefreshIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
    )
}