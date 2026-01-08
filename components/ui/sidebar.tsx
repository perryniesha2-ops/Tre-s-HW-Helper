"use client";

import { Brain, Home, History, Settings, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface SidebarProps {
  user?: User | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Homework Helper
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Learn smarter! 🚀
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
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
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500 dark:border-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>Learning is a journey! 🌟</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
