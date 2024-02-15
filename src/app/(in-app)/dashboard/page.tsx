'use client'

import { LineCart } from '@/components/line-cart'
import { PizzaCart } from '@/components/pizza-cart'

import { Instance, InstanceHeat, useFetchInstances } from '@/queries/instance'
import { Ban, Check, Flame, Send } from 'lucide-react'

export default function DashboardPage() {
  const { data } = useFetchInstances()

  return (
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
              data?.instances.filter(
                (instance: Instance) => instance.status === 'OPEN',
              ).length
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
                (instance: Instance) => instance.status === 'CLOSE',
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
                (instance: Instance) =>
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
                (instance: Instance) => instance.heat === InstanceHeat.TRUE,
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
  )
}
