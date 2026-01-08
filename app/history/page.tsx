import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { HistoryList } from "@/components/history-list";
import { Sidebar } from "@/components/ui/sidebar";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const { data: sessions, error } = await supabase
    .from("homework_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Sidebar user={user} />
      <div className="flex-1 md:ml-64">
        <Header user={user} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <HistoryList sessions={sessions || []} />
        </main>
      </div>
    </div>
  );
}
