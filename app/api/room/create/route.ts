import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json();
  const { quizId, hostId, hostName } = body;
  if (!quizId || !hostName) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const code = nanoid(6).toUpperCase(); // short code
  const room = await prisma.room.create({
    data: { code, quizId, hostId, state: "waiting" },
  });

  // create host player record
  // const player = await prisma.player.create({
  //   data: { roomId: room.id, userId: hostId,code:code, name: hostName, score: 0 },
  // });

  // notify channel (optional)
  // await pusherServer.trigger(`room-${code}`, "player.joined", { player });

  return NextResponse.json({ room});
}
