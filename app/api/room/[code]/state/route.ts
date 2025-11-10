import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function GET( request: NextRequest, { params }: { params: { code: string } }){
     
     const { code } = await params;

   const  players  =  await prisma.player.findMany({
    where:{
        code:code
    }
    });

    return NextResponse.json({ players });

}