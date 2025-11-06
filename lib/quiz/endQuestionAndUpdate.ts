import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function endQuestionAndUpdate(roomCode: string, questionIndex: number) {
  // Get room
  const room = await prisma.room.findUnique({ where: { code: roomCode }});
  if (!room) return;

  // Get quiz questions
  const questions = await prisma.question.findMany({ where: { quizId: room.quizId }});
  const question = questions[questionIndex];

  // Get all answers submitted for this room+question
  const answers = await prisma.playerAnswer.findMany({
    where: { roomCode, questionId: question.id },
  });

  // Score calculation
  const deltas: Record<string, number> = {};
  for (const a of answers) {
    const isCorrect = a.selected === question.answer;
    deltas[a.playerId] = (deltas[a.playerId] || 0) + (isCorrect ? 1 : -1);
  }

  // Apply score delta to each player
  for (const [playerId, delta] of Object.entries(deltas)) {
    await prisma.player.update({
      where: { id: playerId },
      data: { score: { increment: delta }},
    });
  }

  // Fetch updated leaderboard
  const leaderboard = await prisma.player.findMany({
    where: { roomId: room.id },
    orderBy: { score: "desc" },
  });

  // Notify clients question ended
  await pusherServer.trigger(`room-${roomCode}`, "question.ended", {
    questionIndex,
  });

  // Notify clients updated leaderboard
  await pusherServer.trigger(`room-${roomCode}`, "score.updated", {
    leaderboard: leaderboard.map(p => ({
      name: p.name,
      score: p.score,
    })),
  });
}
