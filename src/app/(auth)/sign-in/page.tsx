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
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Invalid username or password");
        setIsSubmitting(false);
      } else {
        toast.error(result.error);
        setIsSubmitting(false);
      }
    }

    if (result?.url) {
      setIsSubmitting(false);
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 relative overflow-hidden">
        
      {/* Background Glow Effects (Consistent with Homepage) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl z-10 mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-white">
            Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Venfer</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to start receiving anonymous feedback
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username or Email</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="Enter your username" 
                        {...field} 
                        className="bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                <>
                    Sign In <LogIn className="ml-2 h-4 w-4"/>
                </>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;