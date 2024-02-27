import { ProfileButton } from '@/components/profile-button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { ReactNode } from 'react'
import { AlertTriangle, Flame } from 'lucide-react'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default async function InAppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="h-full min-h-screen flex flex-col gap-5 bg-slate-950">
      <div className="w-full p-1 bg-red-400 text-slate-200 flex justify-center items-center gap-2">
        <AlertTriangle />
        <p>Produto em fase de testes!</p>
      </div>
      <header>
        <nav className="flex justify-between items-center h-[6vh] border-b-[1px] border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <Flame size={35} className="text-slate-200" />
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
            <OrganizationSwitcher
              appearance={{ baseTheme: dark }}
              hidePersonal={true}
            />
            <ProfileButton />
          </div>
        </nav>
      </header>

      {children}
    </div>
  )
}
