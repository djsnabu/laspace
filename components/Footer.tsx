export default function Footer() {
  return (
    <section id="contact" className="py-20 relative z-20 border-t border-white/10 bg-space-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Tuodaan La Space sinun yökerhoosi?</h2>
            <p className="text-gray-400 mb-8">
              Etsitkö uutta, vetävää konseptia, joka täyttää lattian ja tuo ihmiset paikalle? Ota yhteyttä, niin
              suunnitellaan juuri teidän tilaan sopiva ilta.
            </p>
            <div className="space-y-4 text-gray-300">
              <a
                href="mailto:ganzemutabazi@outlook.com"
                className="flex items-center hover:text-neon-blue transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ganzemutabazi@outlook.com
              </a>
              <a
                href="tel:+358406372737"
                className="flex items-center hover:text-neon-purple transition-colors"
              >
                <svg className="w-5 h-5 mr-3 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +358 40 6372737
              </a>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">Jätä viesti</h3>
            <form action="https://formspree.io/f/xplaceholder" method="POST" className="space-y-4">
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
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Lähetä
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2026 La Space. Kaikki oikeudet pidätetään.</p>
          <p className="mt-2 md:mt-0">Design &amp; Code: KivaMedia.fi</p>
        </div>
      </div>
    </section>
  );
}
