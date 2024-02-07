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

export default function RegisterPage() {
  const form = useForm()

  return (
    <div className="bg-slate-950 h-screen flex justify-center items-center flex-col gap-">
      <h1 className="text-slate-100 font-bold text-4xl">Cadastre-se</h1>
      <span className="text-slate-300 font-semibold text-sm">
        realize seu cadastro para acessar o painel
      </span>

      <Form {...form}>
        <form className="flex flex-col gap-3 mt-5 w-[25vw]">
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
                    placeholder="Insira sua senha"
                    className="bg-slate-700 text-slate-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mt-2 font-semibold">Cadastrar</Button>
        </form>
      </Form>
    </div>
  )
}
