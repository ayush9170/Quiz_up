import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/componets/auth";


export async function GET(req: Request,
  { params }: { params: { code: string } }){
    const session = await auth();
    const { code } = await params;

    const room =   await prisma.room.findUnique({
        where:{
           hostId:session?.user.id,
           code:code
        }
      })

      return NextResponse.json({room});
}