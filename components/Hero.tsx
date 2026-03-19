export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-black/50 to-space-black z-10" />
      <div className="absolute inset-0 bg-space-gray z-0 flex items-center justify-center opacity-30">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/hero.jpg')",
          }}
        />
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter uppercase neon-text">
          WE CREATE <br />
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple"
            style={{ textShadow: "none" }}
          >
            THE NIGHT
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
          La Space tuo yökerhoihin unohtumattomat klubikonseptit, huippu-DJ:t ja täydellisen viban.
        </p>
        <a
          href="#events"
          className="inline-block bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(176,38,255,0.4)]"
        >
          Katso Tulevat Klubit
        </a>
      </div>
    </section>
  );
}
