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
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
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

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(
    { email, password }: z.infer<typeof loginSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()
    setIsLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast({
        title: 'Credenciais inválidas ou usuário não ativado',
        variant: 'destructive',
      })
    }

    if (result?.ok) {
      router.replace('/dashboard')
    }

    setIsLoading(false)
  }

  return (
    <div className="bg-slate-950 h-screen flex justify-center items-center flex-col gap-">
      <h1 className="text-slate-100 font-bold text-4xl">Acessar sua conta</h1>
      <span className="text-slate-300 font-semibold text-sm">
        acesse sua conta enviando suas credenciais abaixo
      </span>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mt-5 w-[70vw] md:w-[25vw]"
        >
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
                    placeholder="Seu e-mail"
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
                    placeholder="Sua senha"
                    className="bg-slate-700 text-slate-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2 font-semibold">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
