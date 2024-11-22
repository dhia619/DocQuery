"use client"

import * as React from "react"
import {
  Home,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  Moon,
  Sun
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useTheme } from "@/contexts/ThemeContext" 


const data = {
  navMain: [
    {
      title: "Ask AI",
      url: "",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Doc 1",
      url: "#",
      emoji: "",
    },
    {
      name: "Doc 2",
      url: "#",
      emoji: "",
    },
    {
      name: "Doc 3",
      url: "#",
      emoji: "",
    },
  ],
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme} 
      className="flex items-center space-x-2 p-2 hover:bg-accent rounded w-full"
    >
      {theme === 'light' ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
    </button>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <ThemeToggle />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}