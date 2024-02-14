import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      profileImageUrl: string
      role: 'ADMIN' | 'USER'
      createdAt: Date
      updatedAt: Date
      token: string
    }
  }
}
