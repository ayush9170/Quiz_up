import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request, { params }: { params: { code: string }}) {
  const { code } = params;
  const { name, userId } = await req.json();
  const room = await prisma.room.findUnique({ where: { code }});
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const player = await prisma.player.create({
    data: { roomId: room.id, userId: userId || null, name, score: 0 },
  });

  await pusherServer.trigger(`room-${code}`, "player.joined", { player });

  return NextResponse.json({ player, room });
}
