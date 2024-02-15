export interface User {
  id: string
  name: string
  email: string
  profileImageUrl: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
  updatedAt: Date
  token: string
}
