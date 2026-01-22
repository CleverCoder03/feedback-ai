"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Example AI-suggested messages to display in the carousel
  const messages = [
    { title: "Message from User 123", content: "What's the one thing you wish you could change about yourself?" },
    { title: "Message from Secret Admirer", content: "I really like your vibe! Do you have a favorite coding language?" },
    { title: "Message from Mystery Friend", content: "Honestly, your latest project was insane! How did you do the animations?" },
    { title: "Message from Curious Dev", content: "What inspired you to start coding in the first place?" },
    { title: "Message from Night Owl", content: "Do you usually code late at night or early in the morning?" },
    { title: "Message from Design Enthusiast", content: "Your UI choices are always clean—do you follow any design principles?" }

  ];

  return (
    <>
      {/* 1. Navbar (Standard Import) */}
      <Navbar />

      {/* 2. Main Container with Dark Background & Subtle Grid */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-950 text-white overflow-hidden relative min-h-screen">
        
        {/* Decorative Gradient Blobs (for that modern glowing effect) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

        {/* 3. Hero Section */}
        <section className="text-center max-w-4xl space-y-6 z-10">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
            Now with AI Suggestions
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Dive into the World of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Anonymous Feedback
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Venfer allows you to collect honest feedback from your friends and followers. 
            Anonymity ensures honesty, and our AI ensures you ask the right questions.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/sign-up">
                <Button size="lg" className="font-bold bg-white text-black hover:bg-gray-200">
                Get Your Link
                </Button>
            </Link>
          </div>
        </section>

        {/* 4. Carousel Section (Showcasing messages) */}
        <section className="mt-20 w-full max-w-5xl">
            <div className="flex items-center justify-center mb-6">
                 <span className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest">
                    <Mail className="w-4 h-4" /> 
                    Live Feedback Stream
                 </span>
            </div>
          
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-gray-200">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">
                        {`"${message.content}"`}
                      </p>
                      <span className="block mt-4 text-xs text-purple-400 font-semibold">
                        Received 5m ago
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Optional: Navigation Buttons hidden on mobile for cleaner look */}
            <div className="hidden md:block">
                <CarouselPrevious className="border-gray-700 bg-black/50 hover:bg-black hover:text-white" />
                <CarouselNext className="border-gray-700 bg-black/50 hover:bg-black hover:text-white" />
            </div>
          </Carousel>
        </section>

        {/* 5. Footer / Copyright */}
        <footer className="mt-24 text-center text-sm text-gray-600">
            © 2026 Venfer. Developed by - <a href="https://vishalmishra.vercel.app" className="underline text-white/70" target="_blank" rel="noopener noreferrer">Vishal Mishra</a>
        </footer>

      </main>
    </>
  );
}