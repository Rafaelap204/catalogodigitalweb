"use client"

import * as React from "react"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

interface SidebarContext {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  React.useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(SIDEBAR_COOKIE_NAME))
      ?.split("=")[1]
    
    if (cookieValue) {
      setCollapsed(cookieValue === "true")
    }
  }, [])

  const handleSetCollapsed = React.useCallback((value: boolean) => {
    setCollapsed(value)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [])

  const toggle = React.useCallback(() => {
    handleSetCollapsed(!collapsed)
  }, [collapsed, handleSetCollapsed])

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed: handleSetCollapsed,
        toggle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export { useSidebar, SidebarProvider }
