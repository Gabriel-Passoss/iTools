'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MoreVertical } from 'lucide-react'
import { useSWRConfig } from 'swr'

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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFetchUsers, activeUser, deleteUser, editUser } from '@/queries/user'
import { useToast } from './ui/use-toast'
import { User } from '@/types/user'

interface ProfileButtonProps {
  userSession: User
}

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

export function ProfileButton({ userSession }: ProfileButtonProps) {
  const { data } = useFetchUsers(userSession.organizationId)
  const { toast } = useToast()
  const { mutate } = useSWRConfig()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profileModalType, setProfileModalType] = useState('profile')

  function formatDate(date: Date) {
    return formatDistanceToNow(date, {
      locale: ptBR,
      addSuffix: true,
    })
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const router = useRouter()

  async function handleSignOut() {
    await signOut({
      redirect: false,
    })

    router.replace('/login')
  }

  async function handleSubmit(
    {
      name,
      email,
      password,
      passwordConfirmation,
    }: z.infer<typeof loginSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()

    const status = await editUser({
      userId: userSession.id,
      name,
      email,
      password,
      passwordConfirmation,
    })

    if (status === 200) {
      toast({ title: 'Usuário editado com sucesso!' })
    }
  }

  async function handleActiveUser(userId: string) {
    const response = await activeUser(userId)

    if (response === 200) {
      toast({ title: 'Usuário ativado com sucesso!' })
      mutate('users')
    }
  }

  async function handleDeleteUser(userId: string) {
    const response = await deleteUser(userId)

    if (response === 200) {
      toast({ title: 'Usuário deletado com sucesso!' })
      mutate('users')
    }
  }

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src="https://github.com/Gabriel-Passoss.png"
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
              setProfileModalType('profile')
            }}
            className="cursor-pointer"
          >
            Perfil
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setIsProfileModalOpen(true)
              setProfileModalType('team')
            }}
            className="cursor-pointer"
          >
            Equipe
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {profileModalType === 'profile' ? (
        <DialogContent className="bg-slate-800 border-0">
          <DialogHeader>
            <DialogTitle className="text-center text-slate-200 text-xl">
              Perfil
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-2">
            <Avatar>
              <AvatarImage
                src="https://github.com/Gabriel-Passoss.png"
                alt="@shadcn"
                className="h-14 w-14 rounded-full cursor-pointer"
              />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col items-center gap-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
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
      ) : (
        <DialogContent className="bg-slate-800 border-0 min-w-[50vw]">
          <DialogHeader>
            <DialogTitle className="text-center text-slate-200 text-xl">
              Equipe
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableCaption>Listagem de todos os membros</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-slate-900">
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Criado há</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            {data?.users.map((user) => {
              return (
                <TableBody
                  className="hover:bg-slate-900 transition-colors"
                  key={user.id}
                >
                  <TableCell className="text-slate-200 text-nowrap flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/Gabriel-Passoss.png"
                        className="h-7 w-7 rounded-full cursor-pointer"
                      />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-200 text-nowrap">
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className="text-slate-200 text-nowrap">
                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                  </TableCell>
                  <TableCell className="text-slate-200 text-nowrap">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    {user.id === userSession.id ||
                    userSession.role === 'USER' ? (
                      <></>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                          <MoreVertical className="text-slate-200" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {user.isActive ? (
                            <></>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActiveUser(user.id)}
                              className="cursor-pointer"
                            >
                              Ativar
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="cursor-pointer"
                          >
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableBody>
              )
            })}
          </Table>
        </DialogContent>
      )}
    </Dialog>
  )
}
