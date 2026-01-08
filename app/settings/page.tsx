import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { SettingsForm } from "@/components/settings-form";
import { Sidebar } from "@/components/ui/sidebar";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Get user preferences
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Sidebar user={user} />
      <div className="flex-1 md:ml-64">
        <Header user={user} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <SettingsForm user={user} preferences={preferences} />
        </main>
      </div>
    </div>
  );
}
