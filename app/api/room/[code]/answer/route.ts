import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const { code } = params;
  const { playerId, questionId, selected } = await req.json();
  // store temp per-room answer in a table or in-memory cache (Redis recommended)
  // For demo: use a simple DB table AnswerRecord or write to PlayerAttempt collection

  await prisma.playerAnswer.create({
    data: { playerId, roomCode: code, questionId, selected },
  });

  // optionally notify host (so host sees live answers)
  await pusherServer.trigger(`room-${code}`, "player.answered", { playerId, questionId });

  return NextResponse.json({ ok: true });
}
