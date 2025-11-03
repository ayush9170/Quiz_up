import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import { auth } from "@/componets/auth" 


export async function  GET(){
     const session = await auth();

    const quiz = await prisma.quiz.findMany({
        where:{
            createdById : session?.user.id
        }
    });
 return NextResponse.json(
    quiz
 )
}