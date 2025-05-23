"use server";

import { NextRequest, NextResponse } from "next/server";
import { generateGeminiResponse } from "@/lib/gemini/gemini";

export async function POST(req: NextRequest) {
   const { message, chatHistory = [] } = await req.json(); // Default empty array


  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  try {
    // Ensure the chat history is trimmed to the last 5 messages
    const recentChatHistory = chatHistory.slice(-5);

    // Generate the response from Gemini
    const aiText = await generateGeminiResponse(message, recentChatHistory);

    return NextResponse.json({
      sender: "bot",
      message: aiText.trim(), // Trim any extra newline or spaces
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
