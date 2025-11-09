import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function GET( { params }: { params: { code: string } }){
     const { code } = await params;

   const res =  await prisma.player.findMany({
    where:{
        code:code
    }
    });

    return NextResponse.json({res});

}