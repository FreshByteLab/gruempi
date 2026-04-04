"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Trophy } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/gruempi", label: "Start" },
  { href: "/gruempi/info", label: "Turnierinfos" },
  { href: "/gruempi/anmeldung", label: "Anmelden" },
  { href: "/gruempi/spielplan", label: "Spielplan" },
  { href: "/gruempi/rangliste", label: "Rangliste" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-primary-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/gruempi"
            className="flex items-center gap-2 font-bold text-lg hover:text-accent-300 transition-colors"
          >
            <Trophy size={22} className="text-accent-400" />
            <span className="hidden sm:block">Grümpelturnier 2026</span>
            <span className="sm:hidden">Grümpeli</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/gruempi/anmeldung"
              className="ml-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Jetzt anmelden
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary-900">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/gruempi/anmeldung"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Jetzt anmelden
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
