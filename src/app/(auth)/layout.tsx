import { nextAuthOptions } from '@/utils/next-auth-options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)

  if (session) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
