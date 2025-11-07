import { auth } from "@/componets/auth";
import Link from "next/link";


export default async function Room({
  params,
}: {
  params: { id: string };
}) {
  const { id } =  await params;
  const session = await auth();

  const res = await fetch("http://localhost:3000/api/room/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizId : id,
      hostId: session?.user.id,
      hostName: session?.user.name,
    }),
    cache: "no-store",
  });

  const data = await res.json();
 

  return(
    <div>
        <Link
        href={`room/${data.room.code}`}> HostPage
        </Link>
    </div>
  );
}
