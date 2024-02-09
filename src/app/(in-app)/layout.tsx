import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function InAppLayout({ children }: { children: ReactNode }) {
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
                <Link href="/heating">Instâncias</Link>
              </li>
            </ul>
          </div>

          <Avatar>
            <AvatarImage
              src="https://github.com/Gabriel-Passoss.png"
              alt="@shadcn"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        </nav>
      </header>

      {children}
    </div>
  )
}
