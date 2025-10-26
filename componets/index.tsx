import Link from 'next/link';
import Footer from './footer';


export default function Landing(){
return(
<div>
 <div className="flex items-center justify-between px-8 py-4 bg-black text-white shadow-md">
 
  <div className="text-2xl font-bold tracking-wide">
    Quiz<span className="text-blue-500">_up</span>
  </div>

  
  <div className="flex space-x-8 text-lg font-medium">
    <Link href="" className="hover:text-blue-400 cursor-pointer transition-colors duration-200">Main</ Link>
    <Link href=""className="hover:text-blue-400 cursor-pointer transition-colors duration-200">About</ Link>
    <Link href="/signup"className="hover:text-blue-400 cursor-pointer transition-colors duration-200">SignUp</ Link>
  </div>
</div>

<div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center space-y-6 px-6">

  <span className="text-5xl md:text-6xl font-extrabold tracking-wide">
    QUIZ TIME : WHERE KNOWLEDGE MEETS COURAGE
  </span>

  
  <span className="text-3xl md:text-4xl font-semibold text-blue-400">
    LET’S BEGIN
  </span>

 
  <span className="text-lg md:text-xl max-w-2xl leading-relaxed text-gray-300">
    Step into the battleground of brilliance where every answer defines your edge.
    Compete, conquer, and claim your crown of knowledge!
  </span>

 
  <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
    Create Quiz
  </button>
</div>

<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 py-16 space-y-12">
  {/* Main Heading */}
  <span className="text-4xl md:text-5xl font-extrabold text-center max-w-4xl leading-tight">
    Step into a world where knowledge meets competition! 
    <br />
    <span className="text-blue-400">Our quiz isn’t just about questions — it’s about strategy, speed, and smart thinking.</span>
  </span>

  {/* Feature Sections */}
  <div className="flex flex-col md:flex-row items-start justify-center gap-10 mt-12 max-w-6xl">
    {/* Card 1 */}
    <div className="flex flex-col bg-gray-900 rounded-2xl p-6 w-full md:w-1/3 hover:shadow-lg hover:scale-105 transition-transform duration-300">
      <span className="text-2xl font-bold text-blue-400 mb-3">Real-Time Competition</span>
      <span className="text-gray-300">
        Challenge players live and see your rank update instantly! Feel the thrill as you race against time — every second and every answer counts.
      </span>
    </div>

    {/* Card 2 */}
    <div className="flex flex-col bg-gray-900 rounded-2xl p-6 w-full md:w-1/3 hover:shadow-lg hover:scale-105 transition-transform duration-300">
      <span className="text-2xl font-bold text-green-400 mb-3">Dynamic Question Rounds</span>
      <span className="text-gray-300">
        Experience a mix of topics, difficulty levels, and surprises in every round. No two quizzes are the same — stay sharp and expect the unexpected!
      </span>
    </div>

    {/* Card 3 */}
    <div className="flex flex-col bg-gray-900 rounded-2xl p-6 w-full md:w-1/3 hover:shadow-lg hover:scale-105 transition-transform duration-300">
      <span className="text-2xl font-bold text-yellow-400 mb-3">Rewards & Leaderboards</span>
      <span className="text-gray-300">
        Earn points, badges, and bragging rights as you climb the leaderboard. Show off your knowledge, top the charts, and become the ultimate quiz champion!
      </span>
    </div>
  </div>
</div>

<Footer></Footer>

</div>
)
}