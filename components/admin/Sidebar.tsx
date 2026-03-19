"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Package,
  CreditCard,
  Ticket,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Logo } from "./Logo"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/administracao/inicio", icon: LayoutDashboard, description: "Visão geral do sistema" },
  { name: "Usuários", href: "/administracao/usuarios", icon: Users, description: "Gerenciar usuários" },
  { name: "Estabelecimentos", href: "/administracao/estabelecimentos", icon: Store, description: "Lojas cadastradas" },
  { name: "Pedidos", href: "/administracao/pedidos", icon: ShoppingCart, description: "Pedidos realizados" },
  { name: "Produtos", href: "/administracao/produtos", icon: Package, description: "Catálogo de produtos" },
  { name: "Planos", href: "/administracao/planos", icon: CreditCard, description: "Planos e assinaturas" },
  { name: "Vouchers", href: "/administracao/vouchers", icon: Ticket, description: "Cupons de desconto" },
  { name: "Configurações", href: "/administracao/configuracoes", icon: Settings, description: "Configurações do sistema" },
]

// Mobile Sidebar Overlay
function MobileOverlay({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  )
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile menu when pressing Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const sidebarContent = (
    <>
      {/* Logo Area */}
      <div 
        className={cn(
          "flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800",
          collapsed ? "justify-center px-2" : "justify-between"
        )}
      >
        <Logo 
          collapsed={collapsed} 
          priority 
          size={collapsed ? "sm" : "md"}
        />
        
        {/* Desktop Toggle Button */}
        <button
          onClick={toggle}
          className={cn(
            "hidden lg:flex h-7 w-7 items-center justify-center rounded-full",
            "border border-gray-300 bg-white shadow-sm",
            "transition-all duration-200",
            "hover:bg-gray-100 hover:border-gray-400",
            "focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2",
            "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
            collapsed && "absolute -right-3.5 top-5"
          )}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav 
        className="flex-1 space-y-1 p-3 overflow-y-auto"
        aria-label="Navegação principal"
      >
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Tooltip key={item.name} delayDuration={collapsed ? 0 : 1000}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                    "text-[14px] font-medium leading-5",
                    "transition-all duration-200 ease-in-out",
                    "focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-1",
                    "outline-offset-2",
                    isActive
                      ? "bg-[#22C55E]/10 text-[#16A34A] dark:bg-[#22C55E]/20 dark:text-[#4ADE80]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                    collapsed && "justify-center px-2"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon 
                    className={cn(
                      "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                      isActive 
                        ? "text-[#22C55E] dark:text-[#4ADE80]" 
                        : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                    )} 
                    aria-hidden="true"
                  />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator dot for collapsed state */}
                  {isActive && collapsed && (
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent 
                  side="right" 
                  className="flex flex-col gap-1"
                  sideOffset={10}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </TooltipContent>
              )}
            </Tooltip>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <Tooltip delayDuration={collapsed ? 0 : 1000}>
          <TooltipTrigger asChild>
            <Link
              href="/login"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[14px] font-medium leading-5",
                "text-red-600 transition-all duration-200",
                "hover:bg-red-50 dark:hover:bg-red-950/20",
                "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut 
                className="h-[18px] w-[18px] flex-shrink-0 text-red-500 group-hover:text-red-600" 
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              Sair do sistema
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </>
  )

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          "fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg",
          "bg-white shadow-md border border-gray-200",
          "lg:hidden",
          "focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2"
        )}
        aria-label="Abrir menu de navegação"
        aria-expanded={mobileOpen}
      >
        <svg 
          className="h-5 w-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[280px]",
          "flex flex-col border-r border-gray-200",
          "bg-white dark:bg-gray-950 dark:border-gray-800",
          "lg:hidden"
        )}
        aria-label="Menu lateral mobile"
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative hidden lg:flex flex-col border-r border-gray-200",
          "bg-white dark:bg-gray-950 dark:border-gray-800",
          collapsed ? "items-center" : ""
        )}
        aria-label="Menu lateral"
      >
        {sidebarContent}
      </motion.aside>
    </TooltipProvider>
  )
}
