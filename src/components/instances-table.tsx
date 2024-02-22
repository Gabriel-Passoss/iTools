import { Loader2, MoreVertical } from 'lucide-react'

import { Instance } from '@/queries/instance'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { toast } from './ui/use-toast'
import { mutate } from 'swr'

interface InstancesTableProps {
  instances: Instance[] | undefined
  isInstanceOptionsDialogOpen: boolean
  setIsInstanceOptionsDialogOpen: (status: boolean) => void
  handleDeleteInstance: (name: string) => void
}

function formatPhone(phone: string) {
  const cleanPhoneNumber = phone.replace(/\D/g, '')
  const match = cleanPhoneNumber.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/)

  if (match) {
    if (match[1] === '55') {
      return '(' + match[2] + ') ' + match[3] + '-' + match[4]
    } else {
      return '+' + match[1] + ' (' + match[2] + ') ' + match[3] + '-' + match[4]
    }
  } else {
    // Retornar o número original se não puder ser formatado
    return phone
  }
}

function formatHeat(heat: string) {
  switch (heat) {
    case 'DAY1':
      return 'Dia 1'
    case 'DAY2':
      return 'Dia 2'
    case 'DAY3':
      return 'Dia 3'
    case 'DAY4':
      return 'Dia 4'
    case 'DAY5':
      return 'Dia 5'
    case 'DAY6':
      return 'Dia 6'
    case 'DAY7':
      return 'Dia 7'
    case 'TRUE':
      return 'Aquecido'
    case 'FALSE':
      return 'Não aquecido'
  }
}

function formatStatus(status: string) {
  switch (status) {
    case 'OPEN':
      return 'Conectada'
    case 'CLOSE':
      return 'Desconectada'
    case 'CONNECTING':
      return 'Conectando'
  }
}

const connectToChatwootSchema = z.object({
  instanceName: z.string(),
  chatwootUrl: z.string().url(),
  chatwootAccountId: z.string(),
  chatwootToken: z.string(),
})

export function InstancesTable({
  instances,
  isInstanceOptionsDialogOpen,
  setIsInstanceOptionsDialogOpen,
  handleDeleteInstance,
}: InstancesTableProps) {
  const [modalType, setModalType] = useState<'Delete' | 'Chatwoot' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof connectToChatwootSchema>>({
    resolver: zodResolver(connectToChatwootSchema),
    defaultValues: {
      chatwootUrl: '',
      chatwootAccountId: '',
      chatwootToken: '',
    },
  })

  async function handleConnectInstanceToChatwoot(
    {
      instanceName,
      chatwootUrl,
      chatwootAccountId,
      chatwootToken,
    }: z.infer<typeof connectToChatwootSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    setIsLoading(true)
    e?.preventDefault()
    await api
      .post('/instances/chatwoot', {
        name: instanceName,
        chatwootUrl,
        chatwootAccountId,
        chatwootAccountToken: chatwootToken,
      })
      .then(() => {
        mutate('instances')
        setIsInstanceOptionsDialogOpen(false)
        toast({ title: 'Conexão efetuada com sucesso!' })
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          toast({
            title: `Houve uma falha ao conectar esta instância ao Chatwoot`,
            variant: 'destructive',
          })
        }
      })

    setIsLoading(false)
    form.reset()
  }

  return (
    <Table>
      <TableCaption>Listagem de instâncias criadas</TableCaption>
      <TableHeader>
        <TableRow className="border-slate-700 hover:bg-slate-800">
          <TableHead className="">Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Número conectado</TableHead>
          <TableHead>Etapa de aquecimento</TableHead>
          <TableHead>Conexão com Chatwoot</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {instances?.map((instance) => {
          return (
            <TableRow
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
              key={instance.id}
            >
              <TableCell className="font-medium">{instance.name}</TableCell>
              <TableCell>{formatStatus(instance.status)}</TableCell>
              <TableCell>{formatPhone(instance.phone)}</TableCell>
              <TableCell>{formatHeat(instance.heat)}</TableCell>
              <TableCell>
                {instance.connectedToChatwoot ? 'Conectado' : 'Desconectado'}
              </TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={isInstanceOptionsDialogOpen}
                  onOpenChange={setIsInstanceOptionsDialogOpen}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{instance.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setIsInstanceOptionsDialogOpen(true)
                          setModalType('Delete')
                        }}
                      >
                        Deletar
                      </DropdownMenuItem>
                      {instance.connectedToChatwoot ? (
                        <></>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setIsInstanceOptionsDialogOpen(true)
                            setModalType('Chatwoot')
                          }}
                        >
                          Conectar Chatwoot
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {modalType === 'Delete' ? (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Você tem certeza?</DialogTitle>
                        <DialogDescription>
                          Essa ação não pode ser desfeita. Isso excluirá
                          permanentemente sua instância e removerá seus dados de
                          nossos servidores.
                        </DialogDescription>
                      </DialogHeader>
                      <Button
                        variant="destructive"
                        className="outline-none ring-offset-0 text-red-100"
                        onClick={() => {
                          handleDeleteInstance(instance.name)
                          setIsInstanceOptionsDialogOpen(false)
                        }}
                      >
                        Tenho certeza
                      </Button>
                    </DialogContent>
                  ) : (
                    <DialogContent className="bg-slate-900 border-0 flex flex-col items-center">
                      <DialogHeader>
                        <DialogTitle className="text-slate-200 text-center">
                          Conectar instância ao Chatwoot
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(
                            handleConnectInstanceToChatwoot,
                          )}
                          className="flex flex-col gap-3 mt-5 w-[70vw] md:w-[25vw]"
                        >
                          <Input
                            type="hidden"
                            {...form.register('instanceName')}
                            defaultValue={instance.name}
                          />

                          <FormField
                            control={form.control}
                            name="chatwootUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-100 font-medium">
                                  Url do Chatwoot
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Insira o url do chatwoot"
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
                                  ID da conta Chatwoot
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Insira o ID da conta Chatwoot"
                                    className="bg-slate-700 text-slate-100"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="chatwootToken"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-100 font-medium">
                                  Token da conta Chatwoot
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Insira o token da conta Chatwoot"
                                    className="bg-slate-700 text-slate-100"
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
                              <span>Conectar</span>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  )}
                </Dialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
