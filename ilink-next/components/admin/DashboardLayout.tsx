"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SidebarProvider } from "@/hooks/use-sidebar"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    email: string
    nome?: string
    avatar?: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header user={user} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto p-4 lg:p-8"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
