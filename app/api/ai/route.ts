import { NextResponse } from "next/server";

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { PrismaClient } from '@prisma/client'
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";
const prisma = new PrismaClient();

// API route
export async function POST(req: Request) {
  const { title, difficulty, userId,subject,numQuestions } = await req.json();

  if (!title || !difficulty || !userId || !subject || !numQuestions) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // ✅ Initialize AI client
  const client = ModelClient(endpoint, new AzureKeyCredential(token!));

  // ✅ Send request to GPT-5
  const aiResponse = await client.path("/chat/completions").post({
    body: {
      model,
      messages: [
        { role: "system", content: "You are a helpful quiz generator AI." },
        {
          role: "user",
          content: `Generate ${numQuestions} ${difficulty} level multiple-choice questions for a quiz titled "${title}" . 
          Each question should have 4 options and one correct answer. 
          Respond in JSON format:
          [
            {"text": "...", "options": ["A", "B", "C", "D"], "answer": "A"},
            ...
          ]`
        }
      ],
    },
  });

  if (isUnexpected(aiResponse)) {
    throw aiResponse.body.error;
  }

  // ✅ Parse GPT response
  const messageContent = aiResponse.body.choices?.[0]?.message?.content;
  if (!messageContent) {
    return NextResponse.json({ error: "No content from AI" }, { status: 500 });
  }

  let questions: any[] = [];
  try {
    questions = JSON.parse(messageContent);
  } catch (err) {
    return NextResponse.json({ error: "Invalid AI JSON response" }, { status: 500 });
  }

  // ✅ Store quiz in MongoDB via Prisma
  const quiz = await prisma.quiz.create({
    data: {
      title,
      createdById: userId,
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          options: q.options,
          answer: q.answer,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json(quiz);
}
