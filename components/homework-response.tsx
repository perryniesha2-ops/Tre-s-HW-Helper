"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Lightbulb,
  ListOrdered,
  Sparkles,
  Target,
  ArrowLeft,
} from "lucide-react";

interface HomeworkResponseProps {
  response: {
    response: string;
    sections: Record<string, string>;
  };
  onReset: () => void;
  subject: string;
}

export function HomeworkResponse({
  response,
  onReset,
  subject,
}: HomeworkResponseProps) {
  const { sections } = response;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Ask Another Question
        </Button>
      </div>

      {/* Success Message */}
      <Card className="border-2 border-green-300 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                Great job asking for help! 🎉
              </h3>
              <p className="text-sm text-green-700">
                Let`&apos;`s work through this together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Sections */}
      <div className="space-y-4">
        {/* Understanding the Problem */}
        {sections.understanding && (
          <Card className="border-2 border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Understanding the Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {sections.understanding}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Concepts */}
        {sections.concepts && (
          <Card className="border-2 border-purple-200 shadow-md">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Key Concepts You Need
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-purple max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {sections.concepts}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step-by-Step Solution */}
        {sections.solution && (
          <Card className="border-2 border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListOrdered className="w-5 h-5 text-orange-600" />
                Step-by-Step Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-orange max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm bg-orange-50 p-4 rounded-lg">
                  {sections.solution}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* The Answer */}
        {sections.answer && (
          <Card className="border-2 border-green-200 shadow-md">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                The Answer
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-green max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-semibold text-lg">
                  {sections.answer}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Practice Problems */}
        {sections.practice && (
          <Card className="border-2 border-pink-200 shadow-md">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-pink-600" />
                Practice Problems - Try These! 💪
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded">
                  <p className="text-sm text-pink-900 font-medium">
                    💡 Tip: Try to solve these on your own first! Then check
                    your work.
                  </p>
                </div>
                <div className="prose prose-pink max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {sections.practice}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full Response (Collapsible) */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="full-response">
          <AccordionTrigger className="text-sm text-gray-600 hover:text-gray-900">
            View Full Response
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-600">
                    {response.response}
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Encouragement Footer */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-semibold text-yellow-900 mb-2">
            🌟 You`&apos;`re doing great! Keep practicing! 🌟
          </p>
          <p className="text-sm text-yellow-700">
            Remember: Making mistakes is part of learning. Keep going!
          </p>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
        >
          Ask Another Question
        </Button>
      </div>
    </div>
  );
}
