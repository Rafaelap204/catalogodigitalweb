"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Metric {
  id: string
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ElementType
  gradient: string
}

interface MetricCardsProps {
  metrics?: Metric[]
  isLoading?: boolean
}

const defaultMetrics: Metric[] = [
  {
    id: "1",
    title: "Total de Usuários",
    value: "2,543",
    description: "Usuários ativos",
    trend: { value: 12.5, isPositive: true },
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    title: "Estabelecimentos",
    value: "156",
    description: "Lojas cadastradas",
    trend: { value: 8.2, isPositive: true },
    icon: Store,
    gradient: "from-[#22C55E] to-[#16A34A]",
  },
  {
    id: "3",
    title: "Pedidos Hoje",
    value: "48",
    description: "Pedidos realizados",
    trend: { value: 3.1, isPositive: false },
    icon: ShoppingCart,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "4",
    title: "Faturamento",
    value: "R$ 12.450",
    description: "Este mês",
    trend: { value: 18.7, isPositive: true },
    icon: DollarSign,
    gradient: "from-purple-500 to-purple-600",
  },
]

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const Icon = metric.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-950"
    >
      {/* Background Gradient on Hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5",
        metric.gradient
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric.title}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {metric.value}
            </h3>
            {metric.description && (
              <p className="mt-1 text-xs text-gray-400">{metric.description}</p>
            )}
          </div>

          {/* Icon */}
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
            metric.gradient
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {/* Trend */}
        {metric.trend && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                metric.trend.isPositive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {metric.trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {metric.trend.value}%
            </span>
            <span className="text-xs text-gray-400">vs mês anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-gray-950">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export function MetricCards({ metrics = defaultMetrics, isLoading = false }: MetricCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  )
}
