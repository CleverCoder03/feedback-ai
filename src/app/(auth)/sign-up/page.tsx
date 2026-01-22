"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Check, Loader2, Mail, User, X, Lock } from "lucide-react"; // Added icons for better UX
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import * as z from "zod";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl z-10 mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-white">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Venfer</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                            placeholder="johndoe" 
                            {...field} 
                            onChange={(e) => {
                                field.onChange(e);
                                debounced(e.target.value);
                            }}
                            className="pl-10 bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500"
                        />
                        {/* Status Icon Indicator inside input */}
                        {isCheckingUsername && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />}
                        {!isCheckingUsername && usernameMessage === "Username is available" && <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />}
                        {!isCheckingUsername && usernameMessage && usernameMessage !== "Username is available" && <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />}
                    </div>
                  </FormControl>
                  
                  {/* Status Text Message */}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-xs mt-1 font-medium ${usernameMessage === "Username is available" ? "text-green-400" : "text-red-400"}`}>
                        {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                            placeholder="m@example.com" 
                            {...field}
                            className="pl-10 bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field}
                            className="pl-10 bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200 mt-4 font-semibold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;