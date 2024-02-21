'use client'

import { Input } from '@/components/ui/input'
import { Instance, deleteInstance, useFetchInstances } from '@/queries/instance'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useSWRConfig } from 'swr'
import { InstancesTable } from '@/components/instances-table'
import { useSession } from 'next-auth/react'
import { CreateInstanceButton } from '@/components/create-instance-button'

export default function InstancesPage() {
  const { data: session } = useSession()
  const { data } = useFetchInstances(session?.user.organizationId)
  const { mutate } = useSWRConfig()
  const { toast } = useToast()
  const [instances, setInstances] = useState<Instance[] | undefined>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [filter, setFilter] = useState('')

  useEffect(() => {
    setInstances(data?.instances)
  }, [data])

  async function handleDeleteInstance(name: string) {
    const { status } = await deleteInstance(name)

    mutate('instances')

    if (status === 200) {
      toast({ title: 'Instância deletada com sucesso!' })
    }
  }

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

      <div className="px-14">
        <InstancesTable
          instances={filterInstances}
          handleDeleteInstance={handleDeleteInstance}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </div>
    </section>
  )
}
