"use client";

import { useEffect, useState } from "react";

interface Event {
  id: number;
  name: string;
  date: string;
  date_label: string;
  venue: string;
  description: string;
  ticket_url?: string;
  image_url?: string;
  color?: string;
  visible?: number;
  sort_order?: number;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-500 col-span-full text-center py-12">Ladataan tapahtumia...</p>;
  }

  if (error) {
    return <p className="text-gray-500 col-span-full text-center py-12">Tapahtumien lataus epäonnistui.</p>;
  }

  if (!events.length) {
    return <p className="text-gray-500 col-span-full text-center py-12">Ei tulevia tapahtumia.</p>;
  }

  return (
    <>
      {events.map((e) => {
        const isBlue = e.color === "blue";
        const borderColor = isBlue ? "hover:border-neon-blue/50" : "hover:border-neon-purple/50";
        const badgeBg = isBlue ? "bg-neon-blue text-black" : "bg-neon-purple text-white";
        const ticketUrl = e.ticket_url || "#";

        return (
          <div
            key={e.id}
            className={"fade-in visible bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors group " + borderColor}
          >
            <div className="h-48 bg-space-gray relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {e.image_url ? (
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${e.image_url}')` }}
                />
              ) : (
                <div className="w-full h-full bg-black/50 group-hover:scale-110 transition-transform duration-700" />
              )}
              <div className="absolute bottom-4 left-4 z-20">
                <span className={"text-xs font-bold px-2 py-1 rounded uppercase tracking-wider " + badgeBg}>
                  {e.date_label}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{e.name}</h3>
              <p className="text-gray-400 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {e.venue}
              </p>
              <p className="text-sm text-gray-500 mb-6">{e.description}</p>
              <a
                href={ticketUrl}
                target={ticketUrl !== "#" ? "_blank" : undefined}
                rel={ticketUrl !== "#" ? "noopener noreferrer" : undefined}
                className="block text-center border border-white/20 hover:bg-white/10 py-2 rounded-lg font-medium transition-colors"
              >
                Liput &amp; Info
              </a>
            </div>
          </div>
        );
      })}
    </>
  );
}
