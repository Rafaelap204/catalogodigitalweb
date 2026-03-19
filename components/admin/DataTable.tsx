"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search,
  Filter,
  Download,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  searchable?: boolean
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowAction?: (action: string, item: T) => void
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  selectable = true,
  pagination = true,
  pageSize = 10,
  onRowAction,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [data, searchQuery])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData
    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, string | number>)[sortConfig.key]
      const bValue = (b as Record<string, string | number>)[sortConfig.key]
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((item) => item.id)))
    }
  }

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-lg border">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:w-72"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border bg-white dark:bg-gray-950"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-900/50">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      selectedRows.size === paginatedData.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      {column.header}
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ArrowDown className="h-4 w-4 flex-shrink-0" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
                  selectedRows.has(item.id) && "bg-[#22C55E]/5"
                )}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(item.id)}
                      onCheckedChange={() => toggleSelectRow(item.id)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.cell(item)}</TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onRowAction?.("edit", item)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRowAction?.("view", item)}
                      >
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onRowAction?.("delete", item)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} de{" "}
            {sortedData.length} resultados
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
