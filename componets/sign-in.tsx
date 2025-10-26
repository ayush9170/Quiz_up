
import { redirect } from "next/dist/server/api-utils"
import { signIn } from "./auth"
import { auth } from "./auth"
 
export default async function SignIn() {
const session= await auth()
if(session) redirect("/");
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 