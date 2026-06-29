const galleryItems = [
  {
    image: "/assets/gallery/ares-davy-01.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-02.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-04.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-02.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-04.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-07.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-03.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-05.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-10.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-05.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-07.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-13.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-06.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-11.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-16.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-08.jpg",
  },
  {
    image: "/assets/gallery/clamo-lola-12.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-11.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-09.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-14.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-12.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-17.jpg",
  },
  {
    image: "/assets/gallery/ares-davy-15.jpg",
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
            Kuvia ja tunnelmia Laspace Eventsin klubi-illoista. Mukana yleisöä, DJ-hetkiä ja täysiä
            tanssilattioita menneistä tapahtumista.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {galleryItems.map((item, index) => (
            <article
              key={`${item.image}-${index}`}
              className="group relative h-64 overflow-hidden bg-space-gray border border-white/10 hover:border-neon-purple/60 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-neon-purple/0 group-hover:bg-neon-purple/10 transition-colors duration-300" />
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
