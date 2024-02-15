import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { LogoutButton } from '@/components/logout-button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function InAppLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="h-screen flex flex-col gap-5 bg-slate-950">
      <header>
        <nav className="flex justify-between items-center h-[6vh] border-b-[1px] border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/logo.png" alt="@shadcn" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <ul className="flex justify-center items-center gap-5 text-slate-600 font-medium text-sm">
              <li className="hover:text-slate-300 transition-colors duration-300">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-slate-300 transition-colors duration-300">
                <Link href="/instances">Instâncias</Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-5">
            <Avatar>
              <AvatarImage
                src="https://github.com/Gabriel-Passoss.png"
                alt="@shadcn"
              />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <LogoutButton />
          </div>
        </nav>
      </header>

      {children}
    </div>
  )
}
