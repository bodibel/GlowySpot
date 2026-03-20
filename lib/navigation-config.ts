import type React from "react"
import {
  LayoutGrid, Users, Heart, Briefcase, User, Store,
  Settings, Calendar, Image as ImageIcon, FileText,
  Info, BarChart3, MessageSquare,
  Filter
} from "lucide-react"

export interface NavLink {
  href?: string
  label: string
  icon: React.ElementType
  onClick?: () => void
  badge?: "unread-messages"
}

export const visitorLinks: NavLink[] = [
  { href: "/", label: "Bejegyzések", icon: LayoutGrid },
  { href: "/providers", label: "Szolgáltatók", icon: Users },
]

export const authLinks: NavLink[] = [
  { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare, badge: "unread-messages" },
  { href: "/dashboard/favorites", label: "Kedvencek", icon: Heart },
]

export const loggedInVisitorLinks: NavLink[] = [
  { href: "/profile/me", label: "Profilom", icon: User },
]

export const providerLinks: NavLink[] = [
  { href: "/dashboard/salons", label: "Vállalkozásom", icon: Store },
  { href: "/profile/me", label: "Profilom", icon: User },
]

export const adminLinks: NavLink[] = [
  { href: "/dashboard/admin/overview", label: "Áttekintés", icon: BarChart3 },
  { href: "/dashboard/admin/providers", label: "Szolgáltatók", icon: Briefcase },
  { href: "/dashboard/admin/visitors", label: "Látogatók", icon: Users },
  { href: "/dashboard/admin/settings", label: "Beállítások", icon: Settings },
]

export function getSalonLinks(salonId: string): NavLink[] {
  return [
    { href: `/salon/${salonId}`, label: "Áttekintés", icon: BarChart3 },
    { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare, badge: "unread-messages" },
    { href: `/salon/${salonId}/posts`, label: "Bejegyzéseim", icon: FileText },
    { href: `/salon/${salonId}/settings`, label: "Adatok", icon: Info },
    { href: `/salon/${salonId}/services`, label: "Szolgáltatások", icon: Briefcase },
    { href: `/salon/${salonId}/gallery`, label: "Galéria", icon: ImageIcon },
    { href: `/salon/${salonId}/hours`, label: "Nyitvatartás", icon: Calendar },
    { href: `/salon/${salonId}/team`, label: "Csapat / Rólam", icon: Users },
    { href: `/salon/${salonId}/contact`, label: "Kapcsolat", icon: Settings },
  ]
}

export function getNavLinks(
  role: string | undefined,
  isSalonContext: boolean,
  salonId: string,
  isLoggedIn: boolean,
  openFilters?: () => void
): NavLink[] {
  if (isSalonContext) return getSalonLinks(salonId)
  if (role === "admin") return [...visitorLinks, ...authLinks, ...adminLinks]
  if (role === "provider") return [...visitorLinks, ...authLinks, ...providerLinks]
  if (isLoggedIn) return [...visitorLinks, ...authLinks, ...loggedInVisitorLinks]

  const links: NavLink[] = [...visitorLinks]
  if (openFilters) {
    links.push({ label: "Szűrők", icon: Filter, onClick: openFilters })
  }
  return links
}
