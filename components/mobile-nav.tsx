"use client";

import { useState } from "react";
import { Brain, Home, History, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
    requireAuth: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    requireAuth: true,
  },
];

interface MobileNavProps {
  user?: User | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center px-4 py-5 border-b">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Homework Helper
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => {
                  if (item.requireAuth && !user) {
                    return null;
                  }

                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-l-4 border-purple-500"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive ? "text-purple-600" : "text-gray-400"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
