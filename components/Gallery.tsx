const galleryItems = [
  {
    title: "Hollaback",
    subtitle: "Freetime · tunnelmakuvia tulossa",
    image: "/api/images/1782143689934.png",
  },
  {
    title: "Laspace Events Live",
    subtitle: "Keikat, DJ:t ja yleisö",
    image: "/api/images/1782143933610.png",
  },
  {
    title: "Klubi-illat",
    subtitle: "Parhaat hetket tanssilattialta",
    image: "/assets/hero.jpg",
  },
  {
    title: "DJ-vibat",
    subtitle: "Laspace Events DJ:t",
    image: "/assets/hero.jpg",
  },
  {
    title: "Yleisö",
    subtitle: "Energia ja fiilis",
    image: "/api/images/1782143689934.png",
  },
  {
    title: "Menneet tapahtumat",
    subtitle: "Lisää kuvia päivitetään pian",
    image: "/api/images/1782143933610.png",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 relative z-20 border-t border-white/5 bg-black/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-neon-blue mb-4">Laspace moments</p>
          <h2 className="text-4xl md:text-6xl font-black mb-5 uppercase tracking-tight">Kuvagalleria</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-gray-400">
            Kuvia ja tunnelmia Laspace Eventsin klubi-illoista. Lisäämme tänne menneiden tapahtumien kuvia sitä mukaa,
            kun kuvamateriaalia saadaan mukaan sivulle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {galleryItems.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="group relative h-64 overflow-hidden bg-space-gray border border-white/10 hover:border-neon-purple/60 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-0 bg-neon-purple/0 group-hover:bg-neon-purple/10 transition-colors duration-300" />
              <div className="absolute left-5 right-5 bottom-5">
                <p className="text-xs uppercase tracking-[0.25em] text-neon-blue mb-2">Kuva {String(index + 1).padStart(2, "0")}</p>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">{item.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/laspaceevents/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-bold text-white hover:border-neon-blue hover:text-neon-blue transition-colors"
          >
            Katso lisää Instagramista @laspaceevents
          </a>
        </div>
      </div>
    </section>
  );
}
