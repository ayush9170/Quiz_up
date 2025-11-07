import { auth } from "./auth"; 
import Link from "next/link";


export default async function Dashboard() {
  const session = await auth();
  const userName = session?.user?.name || "User";


    let quizzes: any[] = [];

try{
    const res = await fetch("http://localhost:3000/api/quiz/quizQues",{
       cache: "no-store",
    });

      if (res.ok) {
      quizzes = await res.json();
    } else {
      console.error("Failed to fetch quizzes:", res.status);
    }
  }catch(e){
    console.error("Error fetching quizzes:", e);
  }

    

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-900 px-8 py-4 shadow-md border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold tracking-wide">
            Quiz<span className="text-blue-500">_up</span>
          </h1>
          <span className="text-lg">
            Welcome, <span className="font-bold">{userName}</span>
          </span>
        </div>



        <Link
          href="/quiz"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow inline-block transition-transform hover:scale-105"
        >
          + Create New Quiz
        </Link>

       
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 text-gray-200 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3">
            Welcome back, <span className="font-bold text-white">{userName}</span> 🎉
          </h2>
          <p className="text-gray-400">
            Manage your quizzes or create a new one using the button above.
          </p>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Your Recent Quizzes</h3>

            {quizzes.length === 0 ? (
              <p className="text-gray-500">No quizzes found. Create one to get started!</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                   <div
      key={quiz.id}
      className="relative bg-gray-800 rounded-xl p-5 hover:bg-gray-700 transition group"
    >
      <h4 className="font-bold text-lg text-white mb-2">
        {quiz.title}
      </h4>

      <p className="text-gray-400 text-sm">
        Created At: {new Date(quiz.createdAt).toLocaleDateString()}
      </p>

      {/* Hover menu */}
      <div
        className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center 
                   gap-3 opacity-0 group-hover:opacity-100 transition z-20 rounded-xl"
      >
        <Link
          href={`/quiz/${quiz.id}`}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Quiz
        </Link>

        <Link
          href={`/quiz/${quiz.id}/room`}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-green-600"
        >
         Create Multiplayer Room
        </Link>
      </div>
    </div>

                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}