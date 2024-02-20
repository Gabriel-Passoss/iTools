'use client'

import useSwr from 'swr'
import { api } from '@/lib/axios'

export enum InstanceStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  CONNECTING = 'CONNECTING',
}

export enum InstanceHeat {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  DAY1 = 'DAY1',
  DAY2 = 'DAY2',
  DAY3 = 'DAY3',
  DAY4 = 'DAY4',
  DAY5 = 'DAY5',
  DAY6 = 'DAY6',
  DAY7 = 'DAY7',
}

export interface Instance {
  id: string
  name: string
  phone: string
  status: InstanceStatus
  heat: InstanceHeat
  used: boolean
  updatedAt: string
}

export interface FetchInstancesResponse {
  instances: Instance[]
}

export interface CreateInstanceResponse {
  instance: Instance
  base64: string
}

export function useFetchInstances(organizationId: string | undefined) {
  return useSwr('instances', async () => {
    const { data } = await api.get<FetchInstancesResponse>(
      `/instances/organization/${organizationId}`,
    )

    return data
  })
}

export async function deleteInstance(name: string) {
  const { status } = await api.delete(`/instances/${name}`)

  return { status }
}
