'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Dado inválido, insira um e-mail' }),
  password: z
    .string()
    .min(10, {
      message: 'Tamanho mínimo de 10 caracteres',
    })
    .max(25, {
      message: 'Tamanho máximo de 25 caracteres',
    }),
})

export default function RegisterPage() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const { toast } = useToast()

  async function onSubmit(
    { name, email, password }: z.infer<typeof registerSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()

    api
      .post('/accounts', { name, email, password })
      .then(() => {
        toast({
          title: 'Cadastro realizado',
          description: 'Contacte um administrador para aprovar seu cadastro',
        })
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast({
            title: 'Usuário já existe',
            variant: 'destructive',
          })
        }
      })
  }

  return (
    <div className="bg-slate-950 h-screen flex justify-center items-center flex-col gap-">
      <h1 className="text-slate-100 font-bold text-4xl">Cadastre-se</h1>
      <span className="text-slate-300 font-semibold text-sm">
        realize seu cadastro para acessar o painel
      </span>

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
                  Nome completo
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-100 font-medium">
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jhondoe@email.com"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-100 font-medium">
                  Senha
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Insira sua senha"
                    className="bg-slate-700 text-slate-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2 font-semibold">
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  )
}
