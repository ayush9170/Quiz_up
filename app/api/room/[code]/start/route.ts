import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { endQuestionAndUpdate } from "@/lib/quiz/endQuestionAndUpdate";

export async function POST(req: Request, { params }: { params: { code: string }}) {
  const { code } = await params;
  const body = await req.json(); // { startIndex?: number, duration?: number }
  const duration = body.duration ?? 15; // seconds per question

  const room = await prisma.room.findUnique({ where: { code }});
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // fetch quiz questions for this quiz
  const questions = await prisma.question.findMany({ where: { quizId: room.quizId }});
  const index = body.startIndex ?? 0;
  const question = questions[index];

  // set room state server-side
  await prisma.room.update({
    where: { code },
    data: { state: "running", currentIndex: index, timeLeft: duration }
  });

  const startedAt = Date.now();

  await pusherServer.trigger(`room-${code}`, "room.started", {
    startedAt,
    questionIndex: index,
    question: { id: question.id, text: question.text, options: question.options },
    duration
  });

  // Optionally set a server-side timer to fire question.ended after duration
  // setTimeout(async () => {
  //   // compute answers, update scores, broadcast question.ended and score.updated
  //   await endQuestionAndUpdate(code, index);
  // }, duration * 1000);

  return NextResponse.json({ ok: true });
}
