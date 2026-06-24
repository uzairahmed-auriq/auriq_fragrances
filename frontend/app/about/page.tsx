import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "About Us | Auriq Perfumery",
  description: "Discover the heritage, philosophy, and artistry behind Auriq's luxury fragrances.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-perfume-main min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gold/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-gold/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

        <section className="container-lux pt-32 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Our Heritage</span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground font-bold tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              The Essence of Auriq
            </h1>
            <p className="text-foreground/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              Born from a passion for the world's most exquisite raw materials, Auriq represents the pinnacle of modern luxury perfumery. We believe that a fragrance is more than a scent; it is an invisible garment, a signature of one's identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
            <div className="lux-glass-card p-2 aspect-[4/5] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=2787&auto=format&fit=crop" alt="Perfume Ingredients" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-serif text-foreground font-bold tracking-widest">Masterfully Crafted</h2>
              <p className="text-foreground/60 leading-relaxed font-light">
                Every bottle of Auriq is the culmination of months of meticulous blending. We source only the rarest ingredients: sustainable Oud from Assam, Bergamot from Calabria, and Rose Centifolia from Grasse. 
              </p>
              <p className="text-foreground/60 leading-relaxed font-light">
                Our master perfumers employ centuries-old extraction techniques combined with avant-garde chemistry to compose fragrances that are both timeless and profoundly contemporary.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <h2 className="text-3xl font-serif text-foreground font-bold tracking-widest">Our Philosophy</h2>
              <p className="text-foreground/60 leading-relaxed font-light">
                True luxury is found in details that others overlook. We do not mass-produce; each batch is limited, ensuring the highest concentration of perfume oils for unprecedented longevity and sillage.
              </p>
              <p className="text-foreground/60 leading-relaxed font-light">
                From our heavy, hand-polished crystal flacons to the magnetic zamac caps, the tactile experience of Auriq is designed to reflect the precious liquid held within.
              </p>
            </div>
            <div className="lux-glass-card p-2 aspect-[4/5] relative overflow-hidden group order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" alt="Auriq Perfume Bottle" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
