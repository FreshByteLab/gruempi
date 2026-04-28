import Link from "next/link";
import { Trophy, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={20} className="text-accent-400" />
              <span className="font-bold text-lg">Grümpelturnier 2026</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Das Kinderfussballturnier für alle Kinder aus Hermetschwil-Staffeln.
              Fairplay, Spass und Gemeinschaft.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/gruempi/info" className="hover:text-white transition-colors">Turnierinfos</Link></li>
              <li><Link href="/gruempi/anmeldung" className="hover:text-white transition-colors">Anmeldung</Link></li>
              <li><Link href="/gruempi/spielplan" className="hover:text-white transition-colors">Spielplan</Link></li>
              <li><Link href="/gruempi/rangliste" className="hover:text-white transition-colors">Rangliste</Link></li>
            </ul>
          </div>

          {/* Contact + legal */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Kontakt & Rechtliches</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Mail size={14} />
              <a href="mailto:sandrozwyssig@gmail.com" className="hover:text-white transition-colors">
                sandrozwyssig@gmail.com
              </a>
            </div>
            <p className="text-sm text-gray-400 mb-4">Veranstalter: EVHS</p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li><Link href="/gruempi/datenschutz" className="hover:text-gray-300 transition-colors">Datenschutz</Link></li>
              <li><Link href="/gruempi/teilnahmebedingungen" className="hover:text-gray-300 transition-colors">Teilnahmebedingungen</Link></li>
              <li><Link href="/gruempi/haftung" className="hover:text-gray-300 transition-colors">Haftungsausschluss</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2026 EVHS – Hermetschwil-Staffeln. Alle Rechte vorbehalten.
          </p>
          <Link
            href="/gruempi/admin"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
