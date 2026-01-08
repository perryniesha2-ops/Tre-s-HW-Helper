import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { subject, question } = await req.json();

    if (!subject || !question) {
      return NextResponse.json(
        { error: "Subject and question are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a friendly, encouraging homework helper for middle and high school students. 

Subject: ${subject}
Student's Question/Problem: ${question}

Please provide help in the following format:

1. **Understanding the Problem**: Break down what the problem is asking in simple terms
2. **Key Concepts**: Explain the main concepts needed to solve this (keep it clear and age-appropriate)
3. **Step-by-Step Solution**: Walk through the solution process, explaining each step
4. **The Answer**: Provide the final answer(s)
5. **Practice Problems**: Create 2-3 similar practice problems (with varying difficulty) that the student can try to reinforce their understanding. Format each practice problem clearly.

Guidelines:
- Be encouraging and positive
- Use clear, simple language appropriate for middle/high school
- Break complex steps into smaller parts
- Explain WHY we do each step, not just HOW
- For math: show all work
- For science: explain concepts with real-world examples when possible
- For English: provide constructive feedback and suggestions
- For history/social studies: provide context and connections
- Make practice problems similar but not identical to the original

Be thorough but concise. Make learning fun!`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the response to extract sections
    const sections = parseResponse(responseText);

    const result = {
      success: true,
      response: responseText,
      sections,
    };

    // Save to database if user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("homework_sessions").insert({
        user_id: user.id,
        subject,
        question,
        response: result,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return NextResponse.json(
      { error: "Failed to get homework help" },
      { status: 500 }
    );
  }
}

function parseResponse(text: string) {
  // Try to extract sections based on numbered format
  const sections: Record<string, string> = {};

  const patterns = [
    {
      key: "understanding",
      regex: /\*\*Understanding the Problem\*\*:?(.*?)(?=\*\*|$)/is,
    },
    { key: "concepts", regex: /\*\*Key Concepts\*\*:?(.*?)(?=\*\*|$)/is },
    {
      key: "solution",
      regex: /\*\*Step-by-Step Solution\*\*:?(.*?)(?=\*\*|$)/is,
    },
    { key: "answer", regex: /\*\*The Answer\*\*:?(.*?)(?=\*\*|$)/is },
    { key: "practice", regex: /\*\*Practice Problems\*\*:?(.*?)$/is },
  ];

  patterns.forEach(({ key, regex }) => {
    const match = text.match(regex);
    if (match) {
      sections[key] = match[1].trim();
    }
  });

  return sections;
}
