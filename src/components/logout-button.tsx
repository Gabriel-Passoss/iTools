'use client'

import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  function handleSignOut() {
    signOut({
      redirect: false,
    })

    router.replace('/login')
  }

  return (
    <Button
      onClick={handleSignOut}
      className="bg-slate-700 hover:bg-slate-800 text-sm flex gap-1"
    >
      <LogOut size={16} />
      Sair
    </Button>
  )
}
