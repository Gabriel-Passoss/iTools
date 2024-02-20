export interface User {
  id: string
  name: string
  email: string
  profileImageUrl: string
  role: 'ADMIN' | 'USER'
  organizationId: string
  createdAt: Date
  updatedAt: Date
  token: string
}
