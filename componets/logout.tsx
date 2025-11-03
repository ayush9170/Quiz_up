'use client'

import { signOut } from "next-auth/react"

export default function Logout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })} 
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  )
}
