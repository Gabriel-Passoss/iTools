import useSwr from 'swr'
import { api } from '@/lib/axios'

export interface User {
  id: string
  name: string
  email: string
  profileImageUrl: string
  role: 'ADMIN' | 'USER'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FetchUsersResponse {
  users: User[]
}

interface EditUserRequestProps {
  userId: string
  name: string | undefined
  email: string | undefined
  password: string
  passwordConfirmation: string
}

export function useFetchUsers(organizationId: string) {
  return useSwr('users', async () => {
    const { data } = await api.get<FetchUsersResponse>(
      `/accounts/organization/${organizationId}`,
    )

    return data
  })
}

export async function activeUser(userId: string) {
  const { status } = await api.put(`/accounts/active/${userId}`)

  return status
}

export async function deleteUser(userId: string) {
  const { status } = await api.delete(`/accounts/${userId}`)

  return status
}

export async function editUser({
  userId,
  name,
  email,
  password,
  passwordConfirmation,
}: EditUserRequestProps) {
  const { status } = await api.put(`/accounts/${userId}`, {
    name,
    email,
    password,
    oldPassword: passwordConfirmation,
  })

  return status
}
