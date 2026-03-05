CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  date_label TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT NOT NULL,
  ticket_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  color TEXT DEFAULT 'purple',
  visible INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO events (name, date, date_label, venue, description, ticket_url, image_url, color, sort_order) VALUES
  ('Neon Nights', '2026-03-15', 'La 15.3.', 'Club Apollo, Helsinki', 'Lineup: DJ Snabu, DJ Example. Ovet 22-04.', '', 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&auto=format&fit=crop', 'purple', 1),
  ('Space Invaders', '2026-03-28', 'Pe 28.3.', 'Ravintola Hullu Poro, Tampere', 'Avaruusteemainen erikoisilta. K20.', '', 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&auto=format&fit=crop', 'blue', 2);
