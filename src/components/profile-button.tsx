'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { SignOutButton, useOrganization, useUser } from '@clerk/nextjs'

const loginSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Dado inválido, insira um e-mail' })
    .optional(),
  password: z
    .string()
    .min(10, {
      message: 'Tamanho mínimo de 10 caracteres',
    })
    .max(25, {
      message: 'Tamanho máximo de 25 caracteres',
    }),
  passwordConfirmation: z
    .string()
    .min(10, {
      message: 'Tamanho mínimo de 10 caracteres',
    })
    .max(25, {
      message: 'Tamanho máximo de 25 caracteres',
    }),
})

export function ProfileButton() {
  const { user: userSession } = useUser()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={userSession?.imageUrl}
              alt="@shadcn"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setIsProfileModalOpen(true)
            }}
            className="cursor-pointer"
          >
            Perfil
          </DropdownMenuItem>

          <SignOutButton>
            <DropdownMenuItem className="cursor-pointer">Sair</DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="bg-slate-800 border-0">
        <DialogHeader>
          <DialogTitle className="text-center text-slate-200 text-xl">
            Perfil
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-2">
          <Avatar>
            <AvatarImage
              src={
                userSession?.hasImage
                  ? userSession.imageUrl
                  : 'https://storage.igamingoperacao.com/instance-heating/boy.png'
              }
              alt="@shadcn"
              className="h-14 w-14 rounded-full cursor-pointer"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <div className="w-full flex flex-col items-center gap-1">
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-3 mt-5 w-[70vw] md:w-[25vw]"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-100 font-medium">
                        Alterar nome
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Insira um nome"
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
                        Alterar e-mail
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
                        Alterar senha
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

                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-100 font-medium">
                        Repita a senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repita sua senha"
                          className="bg-slate-700 text-slate-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-2 font-semibold">
                  Editar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
