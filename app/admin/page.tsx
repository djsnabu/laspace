"use client";

import { useState, useEffect, FormEvent, useRef } from "react";

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

const emptyForm = {
  name: "",
  date: "",
  date_label: "",
  venue: "",
  description: "",
  ticket_url: "",
  image_url: "",
  color: "purple",
  visible: 1,
};

function computeDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];
  const dow = days[date.getDay()];
  return `${dow} ${day}.${month}.`;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: number;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "images" | "contacts">("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef("");

  function getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${passwordRef.current}`,
    };
  }

  async function loadEvents() {
    try {
      const res = await fetch("/api/events?t=" + Date.now(), {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        setMessage("Tapahtumien lataus: HTTP " + res.status);
        return;
      }
      const text = await res.text();
      if (!text) {
        setMessage("Tapahtumien lataus: tyhjä vastaus");
        return;
      }
      setEvents(JSON.parse(text));
    } catch (err) {
      setMessage("Tapahtumien lataus epäonnistui: " + String(err));
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        passwordRef.current = password;
        setAuthed(true);
      } else {
        setMessage("Väärä salasana!");
      }
    } catch (err) {
      setMessage("Yhteysvirhe: " + String(err));
    }
  }

  async function loadContacts() {
    const res = await fetch("/api/contact", { headers: { Authorization: `Bearer ${passwordRef.current}` } });
    if (res.ok) setContacts(await res.json());
  }

  async function markRead(id: number) {
    await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${passwordRef.current}` },
      body: JSON.stringify({ id }),
    });
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: 1 } : c));
  }

  useEffect(() => {
    if (authed) { loadEvents(); loadContacts(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${passwordRef.current}` },
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, image_url: url }));
        setMessage("Kuva ladattu!");
      } else {
        setMessage("Kuvan lataus epäonnistui!");
      }
    } catch {
      setMessage("Kuvan lataus epäonnistui!");
    }
    setUploading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const h = getHeaders();
    const payload = editing ? { ...form, id: editing.id } : form;
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch("/api/events", {
        method,
        headers: h,
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        setMessage(`Virhe ${res.status}: ${text}`);
        setTimeout(() => setMessage(""), 5000);
        return;
      }
      setMessage(editing ? "Tapahtuma päivitetty!" : "Tapahtuma lisätty!");
      setForm(emptyForm);
      setEditing(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadEvents();
    } catch (err) {
      setMessage("Yhteysvirhe: " + String(err));
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: number) {
    if (!confirm("Poistetaanko tapahtuma?")) return;
    await fetch(`/api/events?id=${id}`, { method: "DELETE", headers: getHeaders() });
    setMessage("Tapahtuma poistettu!");
    loadEvents();
    setTimeout(() => setMessage(""), 3000);
  }

  function startEdit(event: Event) {
    setEditing(event);
    setForm({
      name: event.name,
      date: event.date,
      date_label: event.date_label,
      venue: event.venue,
      description: event.description,
      ticket_url: event.ticket_url || "",
      image_url: event.image_url || "",
      color: event.color || "purple",
      visible: event.visible ?? 1,
    });
  }

  const inputClass = "w-full bg-black/50 border border-neon-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors";

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-black px-4 pt-20">
        <form onSubmit={handleLogin} autoComplete="off" className="bg-black/50 border border-neon-purple/30 rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-extrabold mb-6 text-center">
            <span className="text-neon-purple">Admin</span>
          </h1>
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass + " mb-4"}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-3 rounded-lg transition-all hover:opacity-90"
          >
            Kirjaudu
          </button>
          {message && <p className="text-red-400 text-sm mt-3 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">
        <span className="text-neon-purple">La Space</span>{" "}
        <span className="text-neon-blue">Admin</span>
      </h1>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
        {(["events", "images", "contacts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-bold rounded-t-lg transition-all relative ${activeTab === tab ? "bg-neon-purple/20 text-neon-purple border border-b-0 border-neon-purple/30" : "text-gray-400 hover:text-white"}`}
          >
            {tab === "events" ? "Tapahtumat" : tab === "images" ? "Kuvat" : (
              <span className="flex items-center gap-1">
                Viestit
                {contacts.filter(c => !c.read).length > 0 && (
                  <span className="bg-neon-purple text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {contacts.filter(c => !c.read).length}
                  </span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {message && (
        <div className="bg-green-900/30 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg mb-6 text-sm">
          {message}
        </div>
      )}

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          {contacts.length === 0 && <p className="text-gray-500 text-center py-12">Ei viestejä vielä.</p>}
          {contacts.map((c) => (
            <div key={c.id} className={`bg-black/50 border rounded-lg p-5 ${c.read ? "border-white/10" : "border-neon-purple/40"}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="text-gray-400 text-sm ml-3">{c.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">{c.created_at.replace("T", " ").slice(0, 16)}</span>
                  {!c.read && (
                    <button onClick={() => markRead(c.id)} className="text-xs bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple px-3 py-1 rounded transition-all">
                      Merkitse luetuksi
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{c.message}</p>
              {!c.read && <div className="mt-2 w-2 h-2 rounded-full bg-neon-purple" />}
            </div>
          ))}
        </div>
      )}

      {/* Images tab placeholder — existing logic */}
      {activeTab === "images" && (
        <div className="text-center py-12 text-gray-400">
          <p>Avaa <a href="/admin/images" className="text-neon-blue hover:underline">kuvagalleria</a> hallinnoidaksesi kuvia.</p>
        </div>
      )}

      {/* Events tab */}
      {activeTab === "events" && <>

      {/* Add/Edit form */}
      <form onSubmit={handleSave} autoComplete="off" className="bg-black/50 border border-neon-purple/20 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-neon-purple">
          {editing ? "Muokkaa tapahtumaa" : "Lisää uusi tapahtuma"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nimi *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Päivämäärä *{form.date && <span className="ml-2 text-neon-blue">{computeDateLabel(form.date)}</span>}
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => {
                const d = e.target.value;
                setForm({ ...form, date: d, date_label: computeDateLabel(d) });
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Venue *</label>
            <input
              type="text"
              required
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lippu-linkki</label>
            <input
              type="url"
              value={form.ticket_url}
              onChange={(e) => setForm({ ...form, ticket_url: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Tapahtumakuva (suositus: 1080x1350px, 4:5)
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className={"w-full bg-black/50 border border-neon-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-neon-purple/20 file:text-neon-purple hover:file:bg-neon-purple/30"}
            />
            {uploading && <span className="text-sm text-neon-blue animate-pulse">Ladataan...</span>}
          </div>
          {form.image_url && (
            <div className="mt-3 flex items-center gap-3">
              <div className="w-16 aspect-[4/5] relative rounded overflow-hidden border border-neon-purple/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Esikatselu" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-500">{form.image_url}</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, image_url: "" })}
                className="text-red-400 text-xs hover:text-red-300"
              >
                Poista kuva
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Kuvaus</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className={"w-full bg-black/50 border border-neon-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors resize-none"}
          />
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Väri</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, color: "purple" })}
              className={"px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all " + (form.color === "purple" ? "border-neon-purple bg-neon-purple/20 text-neon-purple" : "border-white/20 text-gray-400")}
            >
              Purple
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, color: "blue" })}
              className={"px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all " + (form.color === "blue" ? "border-neon-blue bg-neon-blue/20 text-neon-blue" : "border-white/20 text-gray-400")}
            >
              Blue
            </button>
          </div>
        </div>

        {/* Visible toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, visible: form.visible ? 0 : 1 })}
              className={"w-12 h-6 rounded-full transition-colors relative " + (form.visible ? "bg-neon-purple" : "bg-gray-600")}
            >
              <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-transform " + (form.visible ? "translate-x-7" : "translate-x-1")} />
            </div>
            <span className="text-sm text-gray-400">Näkyvissä</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-2 px-6 rounded-lg text-sm transition-all hover:opacity-90"
          >
            {editing ? "Tallenna" : "Lisää tapahtuma"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="border border-gray-600 text-gray-400 hover:text-white py-2 px-6 rounded-lg text-sm transition-all"
            >
              Peruuta
            </button>
          )}
        </div>
      </form>

      {/* Event list */}
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-black/50 border border-neon-purple/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            {event.image_url && (
              <div className="w-12 aspect-[4/5] relative rounded overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-grow">
              <div className="font-bold">{event.name}</div>
              <div className="text-sm text-gray-400">
                {event.date_label} — {event.venue}
                {event.visible === 0 && <span className="ml-2 text-xs text-red-400">(piilotettu)</span>}
              </div>
              {event.description && (
                <div className="text-xs text-gray-500 mt-1">{event.description}</div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => startEdit(event)}
                className="bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple px-4 py-1.5 rounded text-sm transition-all"
              >
                Muokkaa
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 px-4 py-1.5 rounded text-sm transition-all"
              >
                Poista
              </button>
            </div>
          </div>
        ))}
      </div>
      </>}
    </div>
  );
}
