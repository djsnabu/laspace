"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 relative z-20 border-t border-white/5">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tilaa{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
            uutiskirje
          </span>
        </h2>
        <p className="text-gray-400 mb-8">
          Saa tiedot tulevista klubi-illoista ja tapahtumista suoraan sähköpostiisi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sähköposti@esimerkki.fi"
            required
            disabled={status === "loading"}
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "Lähetetään..." : "Tilaa"}
          </button>
        </form>

        {status === "ok" && (
          <p className="text-green-400 text-sm mt-4 animate-pulse">
            Kiitos! Olet nyt uutiskirjeen tilaaja.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-sm mt-4">
            Jokin meni pieleen. Yritä uudelleen tai kokeile myöhemmin.
          </p>
        )}
      </div>
    </section>
  );
}
