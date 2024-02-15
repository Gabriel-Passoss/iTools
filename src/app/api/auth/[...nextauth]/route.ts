import { api } from '@/lib/axios'
import { User } from '@/types/user'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const response = await api.post<User>('/sessions', {
          email: credentials?.email,
          password: credentials?.password,
        })

        const user = response.data

        if (!user && response.status !== 200) {
          return null
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      session = token.user as any
      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }
