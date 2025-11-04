import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/componets/auth"; 
import { ObjectId } from "bson";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const objectId = new ObjectId(id);

  const attempts = await prisma.userResponse.findMany({
    where: {
      quizId: objectId.toString(),
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(attempts);
}


export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { responses, score } = await req.json();

  const saved = await prisma.userResponse.create({
    data: {
      userId: session.user.id,
      quizId: id,
      responses,
      score,
    },
  });

  return NextResponse.json(saved);
}
