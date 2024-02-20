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
  CreateInstanceResponse,
  Instance,
  deleteInstance,
  useFetchInstances,
} from '@/queries/instance'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useSWRConfig } from 'swr'
import { InstancesTable } from '@/components/instances-table'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import type { MaskitoOptions } from '@maskito/core'
import { useMaskito } from '@maskito/react'
import { useSession } from 'next-auth/react'

const createInstanceSchema = z
  .object({
    name: z.string(),
    phone: z
      .string()
      .min(19)
      .max(19)
      .transform((value) =>
        value
          .replaceAll('+', '')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')
          .replaceAll(' ', ''),
      ),
    heat: z.boolean(),
    chatwoot: z.boolean(),
    chatwootUrl: z.string().optional(),
    chatwootAccountId: z.string().optional(),
    chatwootAccountToken: z.string().optional(),
  })
  .superRefine((values, refinementContext) => {
    if (values.chatwoot === true && values.chatwootUrl === '') {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo de URL não preenchido',
        path: ['chatwootUrl'],
      })
    }

    if (
      values.chatwootUrl !== undefined &&
      !values.chatwootUrl.startsWith('https://')
    ) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo de URL inválido',
        path: ['chatwootUrl'],
      })
    }

    if (values.chatwoot === true && values.chatwootAccountId === '') {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo de ID não preenchido',
        path: ['chatwootId'],
      })
    }

    if (values.chatwoot === true && values.chatwootAccountToken === '') {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo de token da conta não preenchido',
        path: ['chatwootAccountToken'],
      })
    }

    return values
  })

const digitsOnlyMask: MaskitoOptions = {
  mask: [
    '+',
    '5',
    '5',
    ' ',
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
}

export default function InstancesPage() {
  const { data: session } = useSession()
  const { data } = useFetchInstances(session?.user.organizationId)
  const { mutate } = useSWRConfig()
  const { toast } = useToast()
  const [instances, setInstances] = useState<Instance[] | undefined>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const inputRef = useMaskito({ options: digitsOnlyMask })

  const form = useForm<z.infer<typeof createInstanceSchema>>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      name: '',
      phone: '',
      heat: true,
      chatwoot: true,
      chatwootUrl: '',
      chatwootAccountId: '',
      chatwootAccountToken: '',
    },
  })

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

  async function handleCreateInstance(
    {
      name,
      phone,
      heat,
      chatwoot,
      chatwootUrl,
      chatwootAccountId,
      chatwootAccountToken,
    }: z.infer<typeof createInstanceSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()
    setIsLoading(true)
    if (chatwoot === false) {
      await api
        .post<CreateInstanceResponse>('/instances', {
          name,
          phone,
          heat,
          organizationId: session?.user.organizationId,
        })
        .then((response) => {
          setQrCode(response.data.base64)
          mutate('instances')
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 201) {
              toast({ title: 'Instância criada com sucesso!' })
            }

            if (error.response?.status === 409) {
              setIsCreateDialogOpen(false)
              toast({
                title: `Instancia com o mesmo nome ou telefone já existe`,
                variant: 'destructive',
              })
            }
          }
        })
    } else {
      await api
        .post<CreateInstanceResponse>('/instances/chatwoot', {
          organizationId: session?.user.organizationId,
          name,
          phone,
          heat,
          chatwootUrl,
          chatwootAccountId,
          chatwootAccountToken,
        })
        .then((response) => {
          setQrCode(response.data.base64)
          mutate('instances')
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 201) {
              toast({ title: 'Instância criada com sucesso!' })
            }
            if (error.response?.status === 409) {
              setIsCreateDialogOpen(false)
              toast({
                title: `Instancia com o mesmo nome ou telefone já existe`,
                variant: 'destructive',
              })
            }
          }
        })
    }

    setIsLoading(false)
    form.reset()
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
                    mutate('instances')
                  }}
                >
                  Já escaniei
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateInstance)}
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
                            {...field}
                            type="tel"
                            placeholder="Celular"
                            className="bg-slate-700 text-slate-100"
                            ref={inputRef}
                            onInput={(event) => {
                              form.setValue('phone', event.currentTarget.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-slate-200">
                            Aquecimento
                          </FormLabel>
                          <FormDescription className="text-slate-200">
                            Adicionar à esteira de aquecimento de chips
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="bg-green-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chatwoot"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-slate-200">
                            Chatwoot
                          </FormLabel>
                          <FormDescription className="text-slate-200">
                            Conectar instância ao ChatWoot
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="bg-green-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.getValues().chatwoot ? (
                    <>
                      <FormField
                        control={form.control}
                        name="chatwootUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-100 font-medium">
                              Url do chatwoot
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Insira o url"
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
                        name="chatwootAccountId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-100 font-medium">
                              ID do chatwoot
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Insira o id"
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
                        name="chatwootAccountToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-100 font-medium">
                              Token da conta
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Insira o token da conta"
                                className="bg-slate-700 text-slate-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <></>
                  )}

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
          instances={filterInstances}
          handleDeleteInstance={handleDeleteInstance}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </div>
    </section>
  )
}
