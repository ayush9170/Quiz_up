import HostClient from "./HostClient"

export default async function RoomPage({ params }: { params: Promise<{ code: string }>}) {
  const { code } = await params;
  const room = await fetch(`http://localhost:3000/api/room/${code}`).then(r => r.json());
  // fetch quiz metadata or questions if you want server-side
  return <HostClient code={code} room={room} />;
}
