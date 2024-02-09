'use client'

import { LineCart } from '@/components/line-cart'
import { PizzaCart } from '@/components/pizza-cart'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { InstanceHeat, useFetchInstances } from '@/queries/instance'
import { Ban, Check, Flame, Send } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data } = useFetchInstances()

  console.log(data?.instances)

  return (
    <div className="h-screen flex flex-col gap-5 bg-slate-950">
      <header>
        <nav className="flex justify-between items-center h-[6vh] border-b-[1px] border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/logo.png" alt="@shadcn" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <ul className="flex justify-center items-center gap-5 text-slate-600 font-medium text-sm">
              <li className="hover:text-slate-300 transition-colors duration-300">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-slate-300 transition-colors duration-300">
                <Link href="/heating">Instâncias</Link>
              </li>
            </ul>
          </div>

          <Avatar>
            <AvatarImage
              src="https://github.com/Gabriel-Passoss.png"
              alt="@shadcn"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        </nav>
      </header>

      <section className="p-14 flex flex-col gap-5">
        <h1 className="text-4xl font-bold text-slate-200">Dashboard</h1>
        <div className="flex justify-center items-center gap-14">
          <div className="w-[17vw] h-[11vh] border-[1px] border-slate-800 rounded-md py-3 px-5 flex flex-col justify-center gap-2">
            <h2 className="text-slate-200 flex justify-between items-center">
              Instâncias ativas
              <Check size={16} />
            </h2>
            <span className="text-slate-200 font-bold text-2xl">
              {
                data?.instances.filter((instance) => instance.status === 'OPEN')
                  .length
              }
            </span>
          </div>

          <div className="w-[17vw] h-[11vh] border-[1px] border-slate-800 rounded-md py-3 px-5 flex flex-col justify-center gap-2">
            <h2 className="text-slate-200 flex justify-between items-center">
              Instâncias inativas
              <Ban size={16} />
            </h2>
            <span className="text-slate-200 font-bold text-2xl">
              {
                data?.instances.filter(
                  (instance) => instance.status === 'CLOSE',
                ).length
              }
            </span>
          </div>

          <div className="w-[17vw] h-[11vh] border-[1px] border-slate-800 rounded-md py-3 px-5 flex flex-col justify-center gap-2">
            <h2 className="text-slate-200 flex justify-between items-center">
              Instâncias aquecendo
              <Flame size={16} />
            </h2>
            <span className="text-slate-200 font-bold text-2xl">
              {
                data?.instances.filter(
                  (instance) =>
                    instance.heat !== InstanceHeat.FALSE && InstanceHeat.TRUE,
                ).length
              }
            </span>
          </div>

          <div className="w-[17vw] h-[11vh] border-[1px] border-slate-800 rounded-md py-3 px-5 flex flex-col justify-center gap-2">
            <h2 className="text-slate-200 flex justify-between items-center">
              Instâncias aquecidas
              <Flame size={16} />
            </h2>
            <span className="text-slate-200 font-bold text-2xl">
              {
                data?.instances.filter(
                  (instance) => instance.heat === InstanceHeat.TRUE,
                ).length
              }
            </span>
          </div>

          <div className="w-[17vw] h-[11vh] border-[1px] border-slate-800 rounded-md py-3 px-5 flex flex-col justify-center gap-2">
            <h2 className="text-slate-200 flex justify-between items-center">
              Mensagens enviadas
              <Send size={16} />
            </h2>
            <span className="text-slate-200 font-bold text-2xl">1423</span>
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-3 gap-5">
          <LineCart />
          <PizzaCart />
        </div>
      </section>
    </div>
  )
}
