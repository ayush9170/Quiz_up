import HostClient from "./HostClient"

export default async function RoomPage({ params }: { params: Promise<{ code: string }>}) {
  const { code } = await params;
  const data = await fetch(`http://localhost:3000/api/room/${code}`);
  const room  = await data.json();
  // fetch quiz metadata or questions if you want server-side
  return <HostClient code={code}  />;
}
