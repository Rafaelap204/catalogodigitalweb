"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Search, Bell, Sun, Moon, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/hooks/use-sidebar"
import { LogoCompact } from "./Logo"

interface HeaderProps {
  user: {
    email: string
    nome?: string
    avatar?: string
  }
}

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { toggle } = useSidebar()
  const notifications = 3

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95 lg:px-6">
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex lg:hidden">
          <Link href="/administracao/inicio" className="rounded-lg">
            <LogoCompact priority />
          </Link>
        </div>
        <button 
          onClick={toggle} 
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100 lg:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Buscar..." 
            className="w-64 rounded-full border-gray-300 bg-gray-50 pl-10 text-sm focus-visible:ring-[#22C55E] dark:border-gray-700 dark:bg-gray-900" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}>
                <Sun className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}>
                <Moon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificacoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Novo pedido recebido</DropdownMenuItem>
            <DropdownMenuItem>Pagamento confirmado</DropdownMenuItem>
            <DropdownMenuItem>Novo usuario cadastrado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-9 items-center gap-2 rounded-full border bg-gray-50 px-2 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#22C55E] text-[10px] text-white">
                  {(user.nome || user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[100px] truncate text-sm md:block">
                {user.nome || user.email.split("@")[0]}
              </span>
              <ChevronDown className="hidden h-3 w-3 md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.nome || user.email.split("@")[0]}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/administracao/perfil" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/administracao/configuracoes" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configuracoes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-red-600">
              <Link href="/login" className="cursor-pointer flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
