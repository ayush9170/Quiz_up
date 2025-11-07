"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function QuizClient({ id, questions }: { id: string; questions: any[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  
  useEffect(() => {
    fetch(`/api/quiz/${id}/responses`)
      .then((res) => res.json())
      .then((data) => setAttempts(data || []));
  }, [id]);

 const handleSelect = (questionId: string, option: string, correctAnswer: string) => {
  if (answers[questionId]) return;

 
  const question = questions.find(q => q.id === questionId);

  if (!question) return;

  // Determine real correct option:
  // If correctAnswer is a letter (a,b,c,d) → convert to index
  let actualCorrectAnswer = correctAnswer;

  if (/^[a-d]$/i.test(correctAnswer)) {  
    const index = correctAnswer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    actualCorrectAnswer = question.options[index];
  }

  // Check correctness
  const isCorrect = option === actualCorrectAnswer;

  setAnswers(prev => ({ ...prev, [questionId]: option }));
  setScore(prev => prev + (isCorrect ? 1 : -1));
};


  const handleSubmit = async () => {
    const res = await fetch(`/api/quiz/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: answers, score }),
    });

    if (res.ok) {
      const newAttempt = await res.json();
      setAttempts((prev) => [newAttempt, ...prev]);
      alert("Attempt saved!");
    }
  };

useEffect(() => {
  // Fetch initial leaderboard
  fetch(`/api/quiz/${id}/leaderboard`)
    .then((r) => r.json())
    .then(setLeaderboard);

  // Listen for real-time updates
  const channel = pusherClient.subscribe(`quiz-${id}-leaderboard`);
  channel.bind("update", () => {
    fetch(`/api/quiz/${id}/leaderboard`)
      .then((r) => r.json())
      .then(setLeaderboard);
  });

  return () => pusherClient.unsubscribe(`quiz-${id}-leaderboard`);
}, [id]);

  return (
    <div className="flex min-h-screen bg-black text-white p-10 gap-10">
      
      <div className="flex-1 space-y-6">
        <span className="text-3xl font-bold mb-6">Quiz</span>
       
        <h2 className="text-lg text-gray-400 mb-4">Score: {score}</h2>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-gray-900 p-5 rounded-lg border border-gray-800 transition-all duration-200"
          >
            <h3 className="font-semibold mb-3">
              Q{index + 1}: {q.text}
            </h3>
            <ul className="space-y-2">
              {q.options.map((opt: string, i: number) => {

                let correctoption;

                 if (/^[a-d]$/i.test(q.answer)) {
    const index = q.answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
   correctoption= q.options[index];
  }
                const selected = answers[q.id] === opt;
                const correct = selected && opt === correctoption ;
                const wrong = selected && opt !== correctoption;

                return (
                  <li
                    key={i}
                    onClick={() => handleSelect(q.id, opt, q.answer)}
                    className={`p-2 rounded-md cursor-pointer select-none transition-all duration-200
                      ${
                        correct
                          ? "bg-green-600"
                          : wrong
                          ? "bg-red-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                  >
                    {opt}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
        >
          Submit Attempt
        </button>
      </div>

      
      <div className="w-80 bg-gray-900 p-5 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">Previous Attempts</h2>
        {attempts.length === 0 ? (
          <p className="text-gray-400 text-center">No attempts yet.</p>
        ) : (
          <ul className="space-y-3">
            {attempts.map((a) => (
              <li key={a.id} className="bg-gray-800 p-3 rounded-md flex justify-between">
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-green-400">{a.score}</span>
              </li>
            ))}
          </ul>
        )}


  
  <h2 className="text-xl font-bold mb-4 text-center">Leaderboard</h2>

  {leaderboard.length === 0 ? (
    <p className="text-gray-400 text-center">No scores yet.</p>
  ) : (
    <ul className="space-y-3">
      {leaderboard.map((entry, index) => (
        <li key={index} className="bg-gray-800 p-3 rounded-md flex justify-between">
          <span>{entry.user}</span>
          <span className="font-bold text-green-400">{entry.score}</span>
        </li>
      ))}
    </ul>
  )}


      </div>



    </div>
  );
}

type LeaderboardEntry = {
  user: string; 
  score: number;
};
