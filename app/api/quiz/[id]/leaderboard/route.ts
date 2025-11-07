import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const leaderboard = await prisma.userResponse.groupBy({
    by: ["userId"],
    where: { quizId: id },
    _max: { score: true },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: leaderboard.map((r) => r.userId) } },
    select: { id: true, name: true },
  });

  const result = leaderboard
    .map((entry) => ({
      user: users.find((u) => u.id === entry.userId)?.name ?? "Unknown",
      score: entry._max.score ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json(result);
}
