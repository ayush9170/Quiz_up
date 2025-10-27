import { signIn } from "./auth"
import { auth } from "./auth"
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth()
  if(session){
alert('you are already loggedIn');
redirect('/');
  } 
  console.log(session);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome Back</h1>
        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
          className="flex flex-col"
        >
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
