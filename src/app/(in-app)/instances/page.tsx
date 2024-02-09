'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  createInstance,
  deleteInstance,
  useFetchInstances,
} from '@/queries/instance'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useSWRConfig } from 'swr'
import { InstancesTable } from '@/components/instances-table'

const createInstanceSchema = z.object({
  name: z.string(),
  phone: z.string().min(13).max(13),
})

export default function InstancesPage() {
  const { data } = useFetchInstances()
  const { mutate } = useSWRConfig()
  const { toast } = useToast()
  const instances = data?.instances
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const form = useForm<z.infer<typeof createInstanceSchema>>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      name: '',
      phone: '55',
    },
  })

  async function handleDeleteInstance(name: string) {
    const { status } = await deleteInstance(name)

    mutate('instances')

    if (status === 200) {
      toast({ title: 'Instância deletada com sucesso!' })
    }
  }

  async function onSubmit(
    { name, phone }: z.infer<typeof createInstanceSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    setIsLoading(true)
    e?.preventDefault()

    const { status, data } = await createInstance(name, phone)
    setQrCode(data.base64)

    mutate('instances')

    if (status === 201) {
      toast({ title: 'Instância criada com sucesso!' })
    }
    setIsLoading(false)
    form.reset()
  }

  return (
    <section className="p-14 flex flex-col">
      <h1 className="text-4xl font-bold text-slate-200">Instâncias</h1>

      <div className="py-14 px-20 flex items-center gap-x-2">
        <Input
          type="text"
          placeholder="Filtrar instância"
          className="p-5 bg-slate-700 text-slate-100"
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="p-5 bg-green-600 hover:bg-green-700">
              Criar instância
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-0 flex flex-col items-center">
            <DialogHeader>
              <DialogTitle className="text-slate-200 text-center">
                {qrCode
                  ? 'Escaneie o QR Code com o Whatsapp do número inserido'
                  : 'Criar instância'}
              </DialogTitle>
            </DialogHeader>
            {qrCode ? (
              <div className="flex flex-col justify-center gap-5">
                <img src={qrCode} alt="QrCode" />
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setQrCode(null)
                  }}
                >
                  Já escaniei
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-3 mt-5 w-[70vw] md:w-[25vw]"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-100 font-medium">
                          Nome da instância
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nome"
                            className="bg-slate-700 text-slate-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-100 font-medium">
                          Número de celular
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Celular"
                            className="bg-slate-700 text-slate-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 mt-5"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <span>Criar</span>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-14">
        <InstancesTable
          instances={instances}
          handleDeleteInstance={handleDeleteInstance}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </div>
    </section>
  )
}
