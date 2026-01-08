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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Type definitions
interface UserPreferences {
  id: string;
  user_id: string;
  preferred_name: string | null;
  grade_level: string | null;
  favorite_subjects: string[] | null;
  difficulty_preference: string;
  show_step_by_step: boolean;
  show_practice_problems: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
}

interface SettingsFormProps {
  user: SupabaseUser;
  preferences: UserPreferences | null;
}

const GRADE_LEVELS = [
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade (Freshman)" },
  { value: "10", label: "10th Grade (Sophomore)" },
  { value: "11", label: "11th Grade (Junior)" },
  { value: "12", label: "12th Grade (Senior)" },
];

// ... rest of the component stays the same

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy - I'm just starting" },
  { value: "medium", label: "Medium - I understand the basics" },
  { value: "hard", label: "Hard - Challenge me!" },
];

export function SettingsForm({
  user,
  preferences: initialPreferences,
}: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [preferredName, setPreferredName] = useState(
    initialPreferences?.preferred_name || user.user_metadata?.name || ""
  );
  const [gradeLevel, setGradeLevel] = useState(
    initialPreferences?.grade_level || ""
  );
  const [difficultyPreference, setDifficultyPreference] = useState(
    initialPreferences?.difficulty_preference || "medium"
  );
  const [showStepByStep, setShowStepByStep] = useState(
    initialPreferences?.show_step_by_step ?? true
  );
  const [showPracticeProblems, setShowPracticeProblems] = useState(
    initialPreferences?.show_practice_problems ?? true
  );

  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const preferencesData = {
        user_id: user.id,
        preferred_name: preferredName,
        grade_level: gradeLevel,
        difficulty_preference: difficultyPreference,
        show_step_by_step: showStepByStep,
        show_practice_problems: showPracticeProblems,
      };

      const { error } = await supabase
        .from("user_preferences")
        .upsert(preferencesData, {
          onConflict: "user_id",
        });

      if (error) throw error;

      toast.success("Settings saved! 🎉");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Settings & Preferences
        </h1>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>Tell us a bit about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredName">What should we call you?</Label>
              <Input
                id="preferredName"
                placeholder="Your name"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger id="gradeLevel" className="border-2">
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Learning Preferences
            </CardTitle>
            <CardDescription>Customize how you learn best</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Problem Difficulty</Label>
              <Select
                value={difficultyPreference}
                onValueChange={setDifficultyPreference}
              >
                <SelectTrigger id="difficulty" className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-0.5">
                <Label
                  htmlFor="stepByStep"
                  className="text-base cursor-pointer"
                >
                  Show Step-by-Step Solutions
                </Label>
                <p className="text-sm text-gray-600">
                  Get detailed explanations for each step
                </p>
              </div>
              <Switch
                id="stepByStep"
                checked={showStepByStep}
                onCheckedChange={setShowStepByStep}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-0.5">
                <Label
                  htmlFor="practiceProblems"
                  className="text-base cursor-pointer"
                >
                  Show Practice Problems
                </Label>
                <p className="text-sm text-gray-600">
                  Get extra problems to reinforce learning
                </p>
              </div>
              <Switch
                id="practiceProblems"
                checked={showPracticeProblems}
                onCheckedChange={setShowPracticeProblems}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Settings
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
