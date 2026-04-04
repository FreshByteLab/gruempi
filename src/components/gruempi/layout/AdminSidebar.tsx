"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Tag,
  FileText,
  Smartphone,
  Trophy,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/gruempi/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/gruempi/admin/teams", label: "Teams", icon: Users },
  { href: "/gruempi/admin/spiele", label: "Spielplan", icon: Calendar },
  { href: "/gruempi/admin/resultate", label: "Resultate", icon: ClipboardList },
  { href: "/gruempi/admin/kategorien", label: "Kategorien", icon: Tag },
  { href: "/gruempi/admin/inhalte", label: "Inhalte", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link href="/gruempi/admin" className="flex items-center gap-2">
          <Trophy size={20} className="text-accent-400" />
          <div>
            <p className="font-bold text-sm">Grümpelturnier</p>
            <p className="text-xs text-gray-400">Admin-Bereich</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <Link
          href="/gruempi/feld"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Smartphone size={18} />
          Feld-Eingabe
        </Link>
        <Link
          href="/gruempi"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          target="_blank"
        >
          <Trophy size={18} />
          Zur Website
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </form>
      </div>
    </aside>
  );
}
