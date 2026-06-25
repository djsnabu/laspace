"use client";
import { useState } from "react";

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-20 relative z-20 border-t border-white/10 bg-space-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Tuodaan Laspace sinun yökerhoosi?</h2>
            <p className="text-gray-400 mb-8">
              Etsitkö uutta, vetävää konseptia, joka täyttää lattian ja tuo ihmiset paikalle? Ota yhteyttä, niin
              suunnitellaan juuri teidän tilaan sopiva ilta.
            </p>
            <div className="space-y-4 text-gray-300">
              <a
                href="mailto:laspace@laspaceevents.fi"
                className="flex items-center hover:text-neon-blue transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                laspace@laspaceevents.fi
              </a>
              <a
                href="https://www.tiktok.com/@laspaceevents"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.05.86.14V9.4a6.34 6.34 0 0 0-1-.08A6.33 6.33 0 0 0 5 20.39a6.34 6.34 0 0 0 10.86-4.43V8.96a8.16 8.16 0 0 0 4.77 1.52V7.03c-.35 0-.7-.04-1.04-.34Z" />
                </svg>
                TikTok @laspaceevents
              </a>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">Jätä viesti</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nimi / Ravintola"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Sähköpostiosoite"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  name="message"
                  placeholder="Miten voimme auttaa?"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Lähetetään..." : "Lähetä"}
              </button>
              {status === "ok" && (
                <p className="text-green-400 text-sm text-center">Viesti lähetetty! Olemme yhteydessä pian.</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center">Jokin meni pieleen. Yritä uudelleen.</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2026 Laspace. Kaikki oikeudet pidätetään.</p>
          <p className="mt-2 md:mt-0">Website by <a href="https://niceevents.fi" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-colors">Nice Events</a></p>
        </div>
      </div>
    </section>
  );
}
