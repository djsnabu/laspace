"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-space-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/assets/logo-white.png" alt="LaSpace" width={120} height={40} className="h-10 w-auto" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#events" className="hover:text-neon-blue transition-colors px-3 py-2 rounded-md font-medium">
                Tulevat Klubit
              </a>
              <a href="#past-events" className="hover:text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-gray-400">
                Menneet
              </a>
              <a href="#instagram" className="hover:text-neon-purple transition-colors px-3 py-2 rounded-md font-medium">
                Instagram
              </a>
              <a href="#contact" className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all px-4 py-2 rounded-full font-medium">
                Ota yhteyttä
              </a>
            </div>
          </div>
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
            aria-label="Avaa valikko"
            onClick={() => setOpen(!open)}
          >
            <span
              className="block w-6 h-0.5 bg-white transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg) translate(4px, 4px)" : "" }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-opacity duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-transform duration-300"
              style={{ transform: open ? "rotate(-45deg) translate(4px, -4px)" : "" }}
            />
          </button>
        </div>
      </div>
      <div className={"md:hidden bg-space-black/95 backdrop-blur-md border-t border-white/10 " + (open ? "" : "hidden")}>
        <div className="px-4 py-6 space-y-4">
          <a href="#events" onClick={() => setOpen(false)} className="block hover:text-neon-blue transition-colors py-2 font-medium">
            Tulevat Klubit
          </a>
          <a href="#past-events" onClick={() => setOpen(false)} className="block hover:text-gray-300 transition-colors py-2 font-medium text-gray-400">
            Menneet
          </a>
          <a href="#instagram" onClick={() => setOpen(false)} className="block hover:text-neon-purple transition-colors py-2 font-medium">
            Instagram
          </a>
          <a href="#contact" onClick={() => setOpen(false)} className="block bg-white/10 hover:bg-white/20 border border-white/20 transition-all px-4 py-2 rounded-full font-medium text-center">
            Ota yhteyttä
          </a>
        </div>
      </div>
    </nav>
  );
}
