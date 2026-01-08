"use client";

import { createClient } from "@/lib/supabase/client";
import { Brain, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MobileNav } from "@/components/mobile-nav";
import { useUser } from "@/components/user-provider";

export function Header() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Mobile menu and logo (visible on mobile only) */}
        <div className="flex items-center gap-3 md:hidden">
          {user && <MobileNav />}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Emri
            </span>
          </Link>
        </div>

        {/* Spacer for desktop (sidebar handles logo) */}
        <div className="hidden md:block flex-1" />

        {/* User menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-purple-300 dark:border-purple-700">
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                      {getInitials(user.user_metadata?.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white dark:bg-gray-800"
                align="end"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none dark:text-gray-100">
                      {user.user_metadata?.name || "Student"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                asChild
                className="dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
