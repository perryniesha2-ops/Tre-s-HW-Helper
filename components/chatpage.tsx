"use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { HomeworkResponse } from "@/components/homework-response";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface HomeworkResponseData {
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

const SUBJECTS = [
  { value: "math", label: "Math 🔢", icon: "📐" },
  { value: "science", label: "Science 🧪", icon: "🔬" },
  { value: "english", label: "English 📚", icon: "✍️" },
  { value: "history", label: "History 🏛️", icon: "🌍" },
  { value: "foreign-language", label: "Foreign Language 🌎", icon: "🗣️" },
  { value: "computer-science", label: "Computer Science 💻", icon: "🖥️" },
  { value: "other", label: "Other 🎯", icon: "📖" },
];

export function Home() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<HomeworkResponseData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !question.trim()) {
      toast.error("Please select a subject and enter your question!");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, question }),
      });

      if (!res.ok) throw new Error("Failed to get help");

      const data = await res.json();
      setResponse(data);
      toast.success("Got your help! 🎉");

      // Show a toast if user is not signed in
      if (!user) {
        setTimeout(() => {
          toast.info("Sign in to save your homework history!", {
            action: {
              label: "Sign In",
              onClick: () => (window.location.href = "/auth/signin"),
            },
          });
        }, 1000);
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setQuestion("");
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {!response ? (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg dark:bg-gray-800/50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-4 rounded-full animate-bounce-slow">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Need Help with Homework?
                </CardTitle>
                <CardDescription className="text-base mt-2 dark:text-gray-300">
                  Emri will help you understand the problem step-by-step and
                  give you practice problems too!
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Input Form */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl dark:text-gray-100">
                  <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  What do you need help with?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Pick your subject:
                    </label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="w-full h-12 text-base border-2">
                        <SelectValue placeholder="Choose a subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subj) => (
                          <SelectItem
                            key={subj.value}
                            value={subj.value}
                            className="text-base"
                          >
                            <span className="flex items-center gap-2">
                              <span>{subj.icon}</span>
                              <span>{subj.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      What&apos;s your question or problem?
                    </label>
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Example: Solve for x: 2x + 5 = 13&#10;&#10;Or paste multiple problems here!"
                      className="min-h-32 text-base border-2 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Getting your help...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Get Help! <ChevronRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                    Step-by-Step
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Learn how to solve it yourself
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">💡</div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Clear Explanations
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Understand the concepts
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">
                    Practice Problems
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    Reinforce what you learned
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <HomeworkResponse
            response={response}
            onReset={handleReset}
            subject={subject}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Emri - Learn. Practice. Grow. 🌟</p>
        </div>
      </footer>
    </>
  );
}
