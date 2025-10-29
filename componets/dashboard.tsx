import { auth } from "./auth"; 
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  const userName = session?.user?.name || "User";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
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
            <div className="grid md:grid-cols-3 gap-6">
          
              <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-700 transition cursor-pointer">
                <h4 className="font-bold text-lg text-white mb-2">JavaScript Basics</h4>
                <p className="text-gray-400 text-sm">Last attempted: 2 days ago</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-700 transition cursor-pointer">
                <h4 className="font-bold text-lg text-white mb-2">React Fundamentals</h4>
                <p className="text-gray-400 text-sm">Last attempted: 1 week ago</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-700 transition cursor-pointer">
                <h4 className="font-bold text-lg text-white mb-2">Next.js Deep Dive</h4>
                <p className="text-gray-400 text-sm">Last attempted: yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
