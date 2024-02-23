'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Input } from '@/components/ui/input'
import { InstancesTable } from '@/components/instances-table'
import { CreateInstanceButton } from '@/components/create-instance-button'
import { Instance, useFetchInstances } from '@/queries/instance'

export default function InstancesPage() {
  const { data: session } = useSession()
  const { data } = useFetchInstances(session?.user.organizationId)
  const [instances, setInstances] = useState<Instance[] | undefined>([])
  const [isInstanceOptionsDialogOpen, setIsInstanceOptionsDialogOpen] =
    useState(false)

  const [filter, setFilter] = useState('')

  useEffect(() => {
    setInstances(data?.instances)
  }, [data])

  const filterInstances = instances?.filter((instance) =>
    instance.name.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <section className="p-14 flex flex-col">
      <h1 className="text-4xl font-bold text-slate-200">Instâncias</h1>

      <div className="py-14 px-20 flex items-center gap-x-2">
        <Input
          type="text"
          placeholder="Filtrar instância"
          className="p-5 bg-slate-700 text-slate-100"
          onChange={(event) => setFilter(event.target.value)}
        />
        <CreateInstanceButton session={session} />
      </div>

      <div className="px-14 flex flex-col gap-5">
        <InstancesTable
          instances={filterInstances}
          isInstanceOptionsDialogOpen={isInstanceOptionsDialogOpen}
          setIsInstanceOptionsDialogOpen={setIsInstanceOptionsDialogOpen}
        />
      </div>
    </section>
  )
}
