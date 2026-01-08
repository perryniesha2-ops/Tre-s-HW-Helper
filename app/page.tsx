import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { Home } from "@/components/chatpage";
import { UserProvider } from "@/components/user-provider";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Emri - Your Learning Companion",
  description:
    "Get help with your homework and practice problems. Works alongside your code assistant for complete learning support.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <UserProvider initialUser={user}>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Sidebar - Fixed on desktop, hidden on mobile */}
        <Sidebar />

        {/* Main content area - Pushed right on desktop */}
        <div className="flex-1 flex flex-col md:ml-64">
          <Header />
          <Home />
        </div>
      </div>
    </UserProvider>
  );
}
