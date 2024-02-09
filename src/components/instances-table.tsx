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
import { MoreVertical } from 'lucide-react'
import { Button } from './ui/button'
import { Instance } from '@/queries/instance'

interface InstancesTableProps {
  instances: Instance[] | undefined
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (status: boolean) => void
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

export function InstancesTable({
  instances,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteInstance,
}: InstancesTableProps) {
  return (
    <Table>
      <TableCaption>Listagem de instâncias criadas</TableCaption>
      <TableHeader>
        <TableRow className="border-slate-700">
          <TableHead className="">Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Número conectado</TableHead>
          <TableHead>Etapa de aquecimento</TableHead>
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
              <TableCell className="text-right">
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
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
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

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
                        setIsDeleteDialogOpen(false)
                      }}
                    >
                      Tenho certeza
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
