'use client'

import useSwr from 'swr'
import { api } from '@/lib/axios'

export interface Instance {
  id: string
  name: string
  phone: string
  status: string
  heat: string
  used: boolean
  updatedAt: string
}

export interface Root {
  instances: Instance[]
}

async function getInstances() {
  const { data } = await api.get<Root>('/instances')

  return data
}

export function useFetchInstances() {
  return useSwr('instances', getInstances)
}
