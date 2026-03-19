"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  CreditCard,
  Ticket,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  Eye,
} from "lucide-react"
import { MetricCards } from "@/components/admin/MetricCards"
import { ChartsSection } from "@/components/admin/ChartsSection"
import { DataTable } from "@/components/admin/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data for recent orders
const recentOrders = [
  { id: "1", customer: "João Silva", store: "Loja A", amount: 150.0, status: "completed", date: "2024-01-15" },
  { id: "2", customer: "Maria Santos", store: "Loja B", amount: 89.9, status: "pending", date: "2024-01-15" },
  { id: "3", customer: "Pedro Costa", store: "Loja C", amount: 245.5, status: "completed", date: "2024-01-14" },
  { id: "4", customer: "Ana Paula", store: "Loja A", amount: 67.0, status: "cancelled", date: "2024-01-14" },
  { id: "5", customer: "Carlos Lima", store: "Loja D", amount: 189.99, status: "completed", date: "2024-01-13" },
]

const quickActions = [
  { name: "Adicionar Usuário", href: "/administracao/usuarios/adicionar", icon: Users, color: "bg-blue-500" },
  { name: "Novo Estabelecimento", href: "/administracao/estabelecimentos/adicionar", icon: Store, color: "bg-[#22C55E]" },
  { name: "Adicionar Plano", href: "/administracao/planos/adicionar", icon: CreditCard, color: "bg-orange-500" },
  { name: "Criar Voucher", href: "/administracao/vouchers/adicionar", icon: Ticket, color: "bg-purple-500" },
]

const columns = [
  {
    key: "customer",
    header: "Cliente",
    cell: (order: typeof recentOrders[0]) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800">
          {order.customer.charAt(0)}
        </div>
        <span className="font-medium">{order.customer}</span>
      </div>
    ),
    sortable: true,
  },
  {
    key: "store",
    header: "Loja",
    cell: (order: typeof recentOrders[0]) => order.store,
    sortable: true,
  },
  {
    key: "amount",
    header: "Valor",
    cell: (order: typeof recentOrders[0]) => (
      <span className="font-medium">
        R$ {order.amount.toFixed(2).replace(".", ",")}
      </span>
    ),
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (order: typeof recentOrders[0]) => {
      const statusConfig = {
        completed: { label: "Concluído", variant: "default" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" },
        pending: { label: "Pendente", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
        cancelled: { label: "Cancelado", variant: "destructive" as const, className: "bg-red-100 text-red-700 hover:bg-red-100" },
      }
      const config = statusConfig[order.status as keyof typeof statusConfig]
      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      )
    },
    sortable: true,
  },
  {
    key: "date",
    header: "Data",
    cell: (order: typeof recentOrders[0]) => (
      <span className="text-gray-500">{new Date(order.date).toLocaleDateString("pt-BR")}</span>
    ),
    sortable: true,
  },
]

export default function AdminInicioPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo ao painel de controle do Catálogo Digital Web
          </p>
        </div>
        <Button className="bg-[#22C55E] hover:bg-[#16A34A]" asChild>
          <Link href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá!" target="_blank">
            <TrendingUp className="mr-2 h-4 w-4" />
            Suporte via WhatsApp
          </Link>
        </Button>
      </motion.div>

      {/* Metrics */}
      <MetricCards />

      {/* Charts */}
      <ChartsSection />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos realizados no sistema</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/administracao/pedidos">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentOrders}
                columns={columns}
                pagination={false}
                searchable={false}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às funções mais usadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-[#22C55E] hover:shadow-sm"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="flex-1 font-medium text-gray-700 group-hover:text-[#22C55E] dark:text-gray-300">
                        {action.name}
                      </span>
                      <Plus className="h-4 w-4 text-gray-400 group-hover:text-[#22C55E]" />
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Operacional
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Banco de Dados</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Operacional
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Servidor</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Operacional
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
