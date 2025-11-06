"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function PlayerClient({ code, player }: { code: string; player: any }) {
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const ch = pusherClient.subscribe(`room-${code}`);
    ch.bind("room.started", (data: any) => setCurrentQ(data.question));
    ch.bind("question.next",(data: any) => setCurrentQ(data.question));
    ch.bind("question.ended", () => setCurrentQ(null));
    ch.bind("score.updated", (data: any)=> setLeaderboard(data.leaderboard));
    return () => pusherClient.unsubscribe(`room-${code}`);
  }, [code]);

  const answer = async (questionId: string, selected: string) => {
    await fetch(`/api/room/${code}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id, questionId, selected })
    });
    // UI immediate feedback handled by host broadcasting question.ended with correct answer or by local compare if question.answer sent to clients
  };

  return (
    <div>
      <h2>Player: {player.name}</h2>
      {currentQ ? (
        <div>
          <h3>{currentQ.text}</h3>
          {currentQ.options.map((opt: string) => (
            <button key={opt} onClick={() => answer(currentQ.id, opt)}>{opt}</button>
          ))}
        </div>
      ) : (
        <div>Waiting for next question...</div>
      )}

      <div>
        <h3>Leaderboard</h3>
        {leaderboard.map((b:any,i:number) => <div key={i}>{b.name} — {b.score}</div>)}
      </div>
    </div>
  );
}
