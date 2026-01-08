"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HomeworkResponse } from "@/components/homework-response";
import { History, Calendar, BookOpen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Type definitions
interface HomeworkSessionResponse {
  success: boolean;
  response: string;
  sections: {
    understanding?: string;
    concepts?: string;
    solution?: string;
    answer?: string;
    practice?: string;
  };
}

interface Session {
  id: string;
  subject: string;
  question: string;
  response: HomeworkSessionResponse;
  created_at: string;
}

interface HistoryListProps {
  sessions: Session[];
}

const SUBJECT_ICONS: Record<string, string> = {
  math: "📐",
  science: "🔬",
  english: "✍️",
  history: "🌍",
  "foreign-language": "🗣️",
  "computer-science": "🖥️",
  other: "📖",
};

// ... rest of the component stays the same
export function HistoryList({ sessions: initialSessions }: HistoryListProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    const { error } = await supabase
      .from("homework_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      toast.error("Failed to delete session");
      return;
    }

    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast.success("Session deleted");
    router.refresh();
  };

  if (sessions.length === 0) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <History className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
          <p className="text-gray-600 mb-4">
            Your homework sessions will appear here once you start asking
            questions!
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Link href="/">Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Your Homework History
          </h1>
          <p className="text-gray-600">
            Review your past homework sessions and answers
          </p>
        </div>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="border-2 border-purple-200 hover:border-purple-300 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">
                        {SUBJECT_ICONS[session.subject] || "📖"}
                      </span>
                      <span className="capitalize">
                        {session.subject.replace("-", " ")}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.created_at), "PPP 'at' p")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSession(session)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {session.question}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Homework Session</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedSession && (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">
                      {SUBJECT_ICONS[selectedSession.subject] || "📖"}
                    </span>
                    <span className="capitalize">
                      {selectedSession.subject.replace("-", " ")}
                    </span>
                  </h4>
                  <p className="text-gray-700">{selectedSession.question}</p>
                </div>
                <HomeworkResponse
                  response={selectedSession.response}
                  onReset={() => setDialogOpen(false)}
                  subject={selectedSession.subject}
                />
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
