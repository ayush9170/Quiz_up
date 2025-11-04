
import QuizClient from "./QuizClient"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();

  return <QuizClient id={id} questions={data} />;
}
