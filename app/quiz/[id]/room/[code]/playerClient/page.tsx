"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import { use } from "react";
import Link from 'next/link';


export default function PlayerClient({ params }: { params: Promise<{ code: string }> }) {
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const { code } = use(params);
  const[status,setstatus]= useState(false);
  const { data: session } = useSession();
 
  useEffect(() => {
    const ch = pusherClient.subscribe(`room-${code}`);
    ch.bind("room.started", (data: any) => setCurrentQ(data.question));
    ch.bind("question.next", (data: any) => setCurrentQ(data.question));
    ch.bind("question.ended", () => setCurrentQ(null));
    ch.bind("score.updated", (data: any) => setLeaderboard(data.leaderboard));

    return () => pusherClient.unsubscribe(`room-${code}`);
  }, [code]);

  const answer = async (questionId: string, selected: string) => {
    const res = await fetch(`/api/room/${code}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: session?.user.id, questionId, selected }),
    });

    const data = await res.json();
    if (data.ended) { setstatus(true); alert("Quiz ended!");}
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col items-center justify-center py-10 px-6">
      <div className="w-full max-w-3xl bg-[#1a1a1f] rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-400 mb-2">
            Welcome, {session?.user?.name || "Player"}!
          </h2>
          <p className="text-gray-400 text-sm">Room Code: <span className="text-indigo-300">{code}</span></p>
        </div>

        {/* Question Section */}
        {currentQ ? (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4 text-center">
              {currentQ.text}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => answer(currentQ.id, opt)}
                  className="w-full py-3 px-4 rounded-md bg-[#222] border border-gray-700 text-gray-200 hover:bg-indigo-600 hover:text-white transition-all duration-200 font-medium shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6 mb-8 text-center text-gray-400 italic">
           {status? <Link href={'/dashboard '}>QUIZ ENDED ,CLICK TO GO ON DB</Link> : "Waiting for the next question..."}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-yellow-400">
            Leaderboard
          </h3>

          {leaderboard.length > 0 ? (
            <ol className="space-y-2">
              {leaderboard
                .sort((a, b) => b.score - a.score)
                .map((b: any, i: number) => (
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
              Leaderboard will appear soon...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
