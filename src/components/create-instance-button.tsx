'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { Button } from './ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form'
import { api } from '@/lib/axios'
import { CreateInstanceResponse } from '@/queries/instance'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { z } from 'zod'
import { toast } from './ui/use-toast'
import { MaskitoOptions } from '@maskito/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import { Session } from 'next-auth'

interface CreateInstanceButtonProps {
  session: Session | null
}

const createInstanceSchema = z.object({
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

export function CreateInstanceButton({ session }: CreateInstanceButtonProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const inputRef = useMaskito({ options: digitsOnlyMask })

  const form = useForm<z.infer<typeof createInstanceSchema>>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      name: '',
      phone: '',
      heat: false,
    },
  })

  async function handleCreateInstance(
    { name, phone, heat }: z.infer<typeof createInstanceSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()
    setIsLoading(true)
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

    setIsLoading(false)
    form.reset()
  }

  return (
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
  )
}
