"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Sample data
const salesData = [
  { name: "Jan", value: 4500 },
  { name: "Fev", value: 5200 },
  { name: "Mar", value: 4800 },
  { name: "Abr", value: 6100 },
  { name: "Mai", value: 7200 },
  { name: "Jun", value: 6800 },
  { name: "Jul", value: 8500 },
  { name: "Ago", value: 9200 },
  { name: "Set", value: 8800 },
  { name: "Out", value: 9600 },
  { name: "Nov", value: 10200 },
  { name: "Dez", value: 11500 },
]

const ordersData = [
  { name: "Seg", value: 45 },
  { name: "Ter", value: 52 },
  { name: "Qua", value: 38 },
  { name: "Qui", value: 65 },
  { name: "Sex", value: 78 },
  { name: "Sáb", value: 92 },
  { name: "Dom", value: 56 },
]

const usersData = [
  { name: "Jan", value: 1200 },
  { name: "Fev", value: 1450 },
  { name: "Mar", value: 1680 },
  { name: "Abr", value: 1890 },
  { name: "Mai", value: 2100 },
  { name: "Jun", value: 2350 },
]

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

function ChartCard({ title, description, children, icon: Icon, trend, isLoading }: ChartCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  trend.isPositive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}%
              </span>
            )}
            {Icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/10 text-[#22C55E]">
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[250px] w-full px-4 pb-4">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ChartsSectionProps {
  isLoading?: boolean
}

export function ChartsSection({ isLoading = false }: ChartsSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {/* Sales Chart */}
      <ChartCard
        title="Vendas"
        description="Faturamento mensal"
        icon={DollarSign}
        trend={{ value: 12.5, isPositive: true }}
        isLoading={isLoading}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Vendas']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Orders Chart */}
      <ChartCard
        title="Pedidos"
        description="Pedidos por dia da semana"
        icon={ShoppingBag}
        trend={{ value: 8.2, isPositive: true }}
        isLoading={isLoading}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Pedidos']}
            />
            <Bar
              dataKey="value"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Users Chart */}
      <ChartCard
        title="Novos Usuários"
        description="Crescimento mensal"
        icon={Users}
        trend={{ value: 15.3, isPositive: true }}
        isLoading={isLoading}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usersData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Usuários']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#22C55E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
