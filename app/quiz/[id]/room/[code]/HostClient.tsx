"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function HostClient({ code, room }: { code: string; room: any }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState<any | null>(null);

  useEffect(() => {
    const ch = pusherClient.subscribe(`room-${code}`);

    ch.bind("player.joined", (data: any)=> setPlayers(prev => [...prev, data.player]));
    ch.bind("player.left", (data: any)=> setPlayers(prev => prev.filter(p => p.id !== data.playerId)));
    ch.bind("room.started",(data: any) => {
      setCurrentQ(data.question);
      // optionally start host-side timer UI
    });
    ch.bind("score.updated", (data: any) => setLeaderboard(data.leaderboard));

    // fetch initial players/leaderboard
    fetch(`/api/room/${code}/state`).then(r => r.json()).then(s => {
      setPlayers(s.players || []);
      setLeaderboard(s.players?.map((p: any)=> ({ name: p.name, score: p.score })) || []);
    });

    return () => pusherClient.unsubscribe(`room-${code}`);
  }, [code]);

  const start = async () => {
    await fetch(`/api/room/${code}/start`, { method: "POST", body: JSON.stringify({ duration: 180 })});
  };

  return (
    <div>
      <h1>Host view — Room {code}</h1>
      <button onClick={start}>Start Quiz</button>
      <div>
        <h2>Players</h2>
        {players.map(p => <div key={p.id}>{p.name} — {p.score}</div>)}
      </div>

      <div>
        <h2>Leaderboard</h2>
        {leaderboard.map((b,i)=> <div key={i}>{b.name} — {b.score}</div>)}
      </div>
    </div>
  );
}
