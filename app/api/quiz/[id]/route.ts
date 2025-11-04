import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ObjectId } from "bson";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID format" }, { status: 400 });
    }

    const objectId = new ObjectId(id);

    
    const questions = await prisma.question.findMany({
      where: {
        quizId: objectId.toString(),
      },
    });

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this quiz" },
        { status: 404 }
      );
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz questions" },
      { status: 500 }
    );
  }
}
