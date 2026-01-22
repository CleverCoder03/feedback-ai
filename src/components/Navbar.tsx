"use client"

import { User } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquareMore } from "lucide-react" // Import an icon for the logo

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-gray-300 transition-colors">
          <MessageSquareMore className="h-6 w-6" />
          <span>Venfer</span>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium text-gray-300 hidden md:block">
                Welcome, {user?.username || user?.email}
              </span>
              <Button 
                onClick={() => signOut()} 
                variant="destructive" 
                size="sm"
                className="font-semibold"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="default" size="sm" className="font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar