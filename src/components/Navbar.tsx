"use client"

import { User } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"

const Navbar = () => {
    const {data: session} = useSession()

    const user: User | null = session?.user as User | null || null
  return (
    <div>
        <nav className="w-full p-4 bg-gray-800 text-white flex justify-between items-center">
        <div className="text-lg font-bold">
            <Link href="/">Victor</Link>
        </div>
        {
            session?.user ? (
                <div className="flex items-center space-x-4">
                    <span>Welcome, {user?.username || user?.email}</span>
                    <Button onClick={() => signOut()}>Logout</Button>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <Link href="/sign-in">Login</Link>
                </div>
            )
        }
        </nav>
    </div>
  )
}

export default Navbar