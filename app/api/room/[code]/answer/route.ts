import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const { code } = await params;
  const { playerId, questionId, selected } = await req.json();

  // Save this answer
  await prisma.playerAnswer.create({
    data: {  
roomCode: code, questionId,playerId, selected },
  });

  // "player is answering" ping
  await pusherServer.trigger(`room-${code}`, "player.answered", {
    playerId,
    questionId
  });

  // Get all players in the room
  const players = await prisma.player.findMany({
    where: { code: code },
  });

 

  // Get all answers for this question
  const answers = await prisma.playerAnswer.findMany({
    where: { roomCode: code, questionId },
  });

  const room = await prisma.room.findUnique({
    where:{
      code:code
    }
  });

  // Check if all answered
  const allAnswered = answers.length === players.length;

  if (!allAnswered) {
    return NextResponse.json({ ok: true, waiting: true });
  }

  // ---------------------------------------------------------
  // ✅ Step 1: Calculate leaderboard
  // ---------------------------------------------------------
  const correct = await prisma.question.findUnique({
    where: { id: questionId },
     select: { answer: true, options: true },
  });
  
   let actualCorrectAnswer=correct?.answer;

  if (/^[a-d]$/i.test(correct!.answer)) {  
    const index = correct!.answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    actualCorrectAnswer = correct!.options[index];
  }

  // Award +10 for correct answers (example)
  for (const a of answers) {
    if (a.selected === actualCorrectAnswer) {
      const res = await prisma.player.update({
        where: { userId: a.playerId },
        data: { score: { increment: 10 } },
      });
      console.log(res);
    }
    
  }

  // Fetch updated leaderboard
  const leaderboard = await prisma.player.findMany({
    where: { code: code },
    orderBy: { score: "desc" },
    select: { id: true, name: true, score: true },
  });

  // Broadcast updated scoreboard to all players
  await pusherServer.trigger(`room-${code}`, "score.updated", {
    leaderboard,
  });

  // ---------------------------------------------------------
  // ✅ Step 2: Send next question
  // ---------------------------------------------------------
  const questions = await prisma.question.findMany({
    where: { quizId: room?.quizId },
    
  });

  const currentIndex = questions.findIndex(q => q.id === questionId);
  const nextQuestion = questions[currentIndex + 1];

  if (nextQuestion) {
    await pusherServer.trigger(`room-${code}`, "question.next", {
      question: nextQuestion,
    });

    return NextResponse.json({ ok: true, next: nextQuestion.id });
  }

  // ---------------------------------------------------------
  // ✅ Step 3: No more questions → end quiz
  // ---------------------------------------------------------
  await pusherServer.trigger(`room-${code}`, "question.ended", {});


  return NextResponse.json({ ok: true, ended: true });
}
