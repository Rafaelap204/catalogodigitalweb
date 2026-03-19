"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  collapsed?: boolean
  className?: string
  showText?: boolean
  priority?: boolean
}

// Fallback SVG Logo Component
function LogoSVG({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dimensions = {
    sm: { container: 32, icon: 20 },
    md: { container: 40, icon: 24 },
    lg: { container: 48, icon: 28 },
  }

  const { container, icon } = dimensions[size]

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A]",
        className
      )}
      style={{ width: container, height: container }}
      aria-hidden="true"
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fillOpacity="0.9"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  )
}

// Text Logo Component
function LogoText({ 
  collapsed, 
  className 
}: { 
  collapsed?: boolean
  className?: string 
}) {
  if (collapsed) return null

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-[14px] font-bold leading-tight tracking-tight text-[#1A1A1A] dark:text-white">
        Catálogo Digital
      </span>
      <span className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">
        Web
      </span>
    </div>
  )
}

export function Logo({
  size = "md",
  collapsed = false,
  className,
  showText = true,
  priority = false,
}: LogoProps) {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = dimensions[size]

  // Use SVG fallback if image fails to load or if in collapsed mode with no text
  const useFallback = imageError || collapsed

  return (
    <div 
      className={cn(
        "flex items-center gap-3 transition-all duration-300",
        collapsed && "justify-center",
        className
      )}
      aria-label="Catálogo Digital Web"
    >
      {useFallback ? (
        <LogoSVG size={size} />
      ) : (
        <div className="relative" style={{ width, height }}>
          <Image
            src="/logo.png"
            alt="Logo Catálogo Digital"
            fill
            priority={priority}
            className={cn(
              "rounded-xl object-contain transition-opacity duration-300",
              !imageLoaded && "opacity-0"
            )}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            sizes={`${width}px`}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoSVG size={size} />
            </div>
          )}
        </div>
      )}
      
      {showText && <LogoText collapsed={collapsed} />}
    </div>
  )
}

// Compact Logo for Header/Avatar usage
export function LogoCompact({ 
  className,
  priority = false 
}: { 
  className?: string
  priority?: boolean 
}) {
  const [imageError, setImageError] = React.useState(false)

  if (imageError) {
    return <LogoSVG size="sm" className={className} />
  }

  return (
    <div 
      className={cn("relative h-8 w-8 overflow-hidden rounded-lg", className)}
      aria-label="Catálogo Digital"
    >
      <Image
        src="/logo.png"
        alt=""
        fill
        priority={priority}
        className="object-contain"
        onError={() => setImageError(true)}
        sizes="32px"
      />
    </div>
  )
}

// Skeleton Loader for Logo
export function LogoSkeleton({ 
  collapsed = false,
  className 
}: { 
  collapsed?: boolean
  className?: string 
}) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3",
        collapsed && "justify-center",
        className
      )}
    >
      <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      {!collapsed && (
        <div className="flex flex-col gap-1">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      )}
    </div>
  )
}
