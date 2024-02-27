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
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSignIn } from '@clerk/nextjs'

const loginSchema = z.object({
  email: z.string().email({ message: 'Dado inválido, insira um e-mail' }),
})

export default function LoginPage() {
  const router = useRouter()
  const [sentMagicLink, setSentMagicLink] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, setActive } = useSignIn()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const createFlow = signIn?.createEmailLinkFlow()

  async function onSubmit(
    { email }: z.infer<typeof loginSchema>,
    e?: React.BaseSyntheticEvent,
  ) {
    e?.preventDefault()
    setIsLoading(true)

    const si = await signIn?.create({ identifier: email })

    if (si === undefined) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { emailAddressId } = si.supportedFirstFactors.find(
      (ff) => ff.strategy === 'email_link' && ff.safeIdentifier === email,
    )

    setSentMagicLink(true)

    const res = await createFlow?.startEmailLinkFlow({
      emailAddressId,
      redirectUrl: 'http://localhost:3000/dashboard',
    })

    setIsLoading(false)

    if (res?.status === 'complete' && setActive) {
      setActive({ session: res.createdSessionId })
      router.replace('/dashboard')
    }
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

          <Button type="submit" className="mt-2 font-semibold">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </Button>

          <div
            className={`bg-green-300 border-[1px] rounded-md border-green-700 justify-around items-center p-3 ${sentMagicLink ? 'flex opacity-100 transition-all duration-300 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <BadgeCheck />
            <div className="flex flex-col gap-2">
              <h3 className="text-md flex items-center font-medium">
                Um email com o link mágico foi enviado.
              </h3>
              <span className="text-sm text-left">
                Certifique-se de verificar sua pasta de spam.
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
