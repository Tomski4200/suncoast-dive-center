import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hey, {user.email}!</span>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md text-sm bg-gray-200 hover:bg-gray-300">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/auth/login"
        className="py-2 px-4 rounded-md text-sm bg-[#ffefbf] hover:bg-[#ffe99f] text-black"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="py-2 px-4 rounded-md text-sm bg-[#8cda3f] hover:bg-[#7bc235] text-white"
      >
        Sign up
      </Link>
    </div>
  )
}