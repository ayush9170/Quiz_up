"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function HostClient({ code}: { code: string}) {
  const [players, setPlayers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState<any | null>(null);

  useEffect(() => {
    const ch = pusherClient.subscribe(`room-${code}`);

    ch.bind("player.joined", (data: any) =>
      setPlayers((prev) => [...prev, data.player])
    );
    ch.bind("player.left", (data: any) =>
      setPlayers((prev) => prev.filter((p) => p.id !== data.playerId))
    );
    ch.bind("room.started", (data: any) => setCurrentQ(data.question));
    ch.bind("score.updated", (data: any) => setLeaderboard(data.leaderboard));

    fetch(`/api/room/${code}/state`)
      .then((r) => r.json())
      .then((s) => {
        setPlayers(s.players || []);
        setLeaderboard(
          s.players?.map((p: any) => ({ name: p.name, score: p.score })) || []
        );
      });

    return () => pusherClient.unsubscribe(`room-${code}`);
  }, [code]);

  const start = async () => {
    await fetch(`/api/room/${code}/start`, {
      method: "POST",
      body: JSON.stringify({ duration: 180 }),
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-[#1a1a1f] rounded-xl p-8 shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Host Dashboard — Room <span className="text-indigo-300">{code}</span>
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={start}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white shadow-md transition transform hover:scale-105 active:scale-95"
          >
            🚀 Start Quiz
          </button>
        </div>

        {currentQ && (
          <div className="bg-[#222] border border-gray-700 p-5 rounded-lg mb-8 text-center">
            <h2 className="text-xl font-semibold mb-2 text-indigo-400">
              Current Question
            </h2>
            <p className="text-gray-200">{currentQ.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Players */}
          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4 text-center text-indigo-300">
              Players
            </h2>
            {players.length > 0 ? (
              <ul className="space-y-2">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="flex justify-between bg-[#1f1f24] hover:bg-[#2a2a31] px-4 py-2 rounded-md transition"
                  >
                    <span>{p.name}</span>
                    <span className="text-indigo-400 font-semibold">
                      {p.score ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No players yet...</p>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400">
              Leaderboard
            </h2>
            {leaderboard.length > 0 ? (
              <ol className="space-y-2">
                {leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((b, i) => (
                    <li
                      key={i}
                      className="flex justify-between bg-[#1f1f24] hover:bg-[#2a2a31] px-4 py-2 rounded-md transition"
                    >
                      <span>
                        {i + 1}. {b.name}
                      </span>
                      <span
                        className={`font-semibold ${
                          i === 0
                            ? "text-yellow-400"
                            : i === 1
                            ? "text-gray-300"
                            : i === 2
                            ? "text-amber-600"
                            : "text-indigo-400"
                        }`}
                      >
                        {b.score}
                      </span>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="text-center text-gray-500">
                Leaderboard will appear after the quiz starts.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
