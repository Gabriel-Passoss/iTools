'use client'

import { createContext, ReactNode, useState } from 'react'
import { setCookie } from 'nookies'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

import { api } from '@/lib/axios'

type UserProviderProps = {
  children: ReactNode
}

interface SignInProps {
  email: string
  password: string
}

interface UserProps {
  name: string
  email: string
  profileImageUrl: string
  role: 'USER' | 'ADMIN'
}

interface AuthContextProps {
  isAuthenticated: boolean
  user: UserProps | null
  signIn: (data: SignInProps) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null)
  const isAuthenticated = false

  const router = useRouter()

  async function signIn({ email, password }: SignInProps) {
    await api
      .post('/sessions', {
        email,
        password,
      })
      .then((response) => {
        setCookie(undefined, 'itools.token', response.data.access_token, {
          maxAge: 60 * 60 * 24, // 24 Hours
        })
        setUser(jwtDecode(response.data.access_token))

        router.push('/dashboard')
      })
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
