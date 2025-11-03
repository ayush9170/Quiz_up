import { notFound } from "next/navigation";

export default async function QuizDetails({ params }: { params?: { id?: string } }) {
  const id  = params?.id;

 
  const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return notFound();
  }

  const quiz = await res.json();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-400 mb-6">{quiz.description}</p>

      <div className="space-y-6">
        {quiz.questions?.map((q: any, index: number) => (
          <div key={q.id} className="bg-gray-900 p-5 rounded-lg border border-gray-800">
            <h3 className="font-semibold mb-3">
              Q{index + 1}: {q.question}
            </h3>
            <ul className="space-y-2">
              {q.options.map((opt: string, i: number) => (
                <li key={i} className="bg-gray-800 p-2 rounded-md">
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
