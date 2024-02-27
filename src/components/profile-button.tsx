'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useState } from 'react'

import { Dialog, DialogContent } from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutButton, UserProfile, useUser } from '@clerk/nextjs'

export function ProfileButton() {
  const { user: userSession } = useUser()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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

      <DialogContent className="bg-transparent border-0 max-h-[70vh] min-w-fit p-8 flex justify-center">
        <UserProfile
          appearance={{
            elements: { rootBox: 'max-h-[70vh] justify-center ' },
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
