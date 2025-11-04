"use client";
import { useEffect, useState } from "react";

export default function QuizClient({ id, questions }: { id: string; questions: any[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<any[]>([]);

  
  useEffect(() => {
    fetch(`/api/quiz/${id}/responses`)
      .then((res) => res.json())
      .then((data) => setAttempts(data || []));
  }, [id]);

  const handleSelect = (questionId: string, option: string, correctAnswer: string) => {
   
    if (answers[questionId]) return;

    const isCorrect = option === correctAnswer;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));

   
    setScore((prev) => prev + (isCorrect ? 1 : -1));
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

  return (
    <div className="flex min-h-screen bg-black text-white p-10 gap-10">
      
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Real-Time Quiz</h1>
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
                const selected = answers[q.id] === opt;
                const correct = selected && opt === q.answer;
                const wrong = selected && opt !== q.answer;

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
      </div>
    </div>
  );
}
