'use client';
import Link from 'next/link';
import Footer from './footer';

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';


export default function LandingClient({ session }: { session: any }){
  const [code,setcode] =useState("");
   const [loading, setLoading] = useState(false);

  const router = useRouter();

    const handleClick = () => {
      if(session == null) { router.push('/signup');
        alert('PLEASE LOGIN ')
      }
    else router.push('/dashboard');
  };

    async function handleSubmit(e: React.FormEvent){
      if(!session) {
        alert("first login");
        return;
      }
      e.preventDefault();
      setLoading(true);
    const res = await fetch(`http://localhost:3000/api/room/${code}/join`,{
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name:session.user.name,userId:session.user.id }),
     });

     const data =await res.json();
     setLoading(false);

     if(res.ok){
      alert(`Joined successfully`);
      router.push(`/quiz/${data.room.quizId}/room/${code}/playerClient`);
     }
     else {
      console.log(data);
      alert(`Error: ${data.error}`);
     }

  }

return(
<div>
 <div className="flex items-center justify-between px-8 py-4 bg-black text-white shadow-md">
 
  <div className="text-2xl font-bold tracking-wide">
    Quiz<span className="text-blue-500">_up</span>
  </div>

  
  <div className="flex space-x-8 text-lg font-medium">
    <Link href="" className="hover:text-blue-400 cursor-pointer transition-colors duration-200">Main</ Link>
    <Link href=""className="hover:text-blue-400 cursor-pointer transition-colors duration-200">About</ Link>
    
   
    {session?    <Link href="/logout"className="hover:text-blue-400 cursor-pointer transition-colors duration-200">  Hello! {session.user?.name}</ Link> 
       
    :   <Link href="/signup"className="hover:text-blue-400 cursor-pointer transition-colors duration-200"> SignUp</ Link>}
    
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

 
  <button 
  onClick={handleClick}
   className=" cursor-pointer mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg" 
     >
    Create Quiz
  </button>

  <form 
  className="w-full flex  mt-10 bg-black  items-center justify-center mt-10 px-6"
  onSubmit={handleSubmit}
>
  <div className="flex items-center gap-3 bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-700/40 max-w-xl w-full">
    
    <input
      type="text"
      name="Enter code to join quiz"
      value={code}
      onChange={(e) => setcode(e.target.value)}
      placeholder="ENTER CODE TO JOIN QUIZ"
      className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white 
                 placeholder-gray-400 tracking-wider text-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl 
                 hover:bg-blue-700 transition-transform hover:scale-105 shadow-md"
    >
      {loading ? "Joining..." : "JOIN"}
    </button>

  </div>
</form>

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