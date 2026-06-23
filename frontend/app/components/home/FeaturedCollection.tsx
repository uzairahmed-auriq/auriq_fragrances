import Link from "next/link";
import Image from "next/image";

export default function FeaturedCollection() {
  const collectionLinks = [
    { name: "Oud Collection", handle: "oud", image: "/placeholder.jpg" },
    { name: "Floral Collection", handle: "floral", image: "/placeholder.jpg" },
    { name: "Woody Collection", handle: "woody", image: "/placeholder.jpg" },
  ];

  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden">
      <div className="container-lux relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Curated Signatures</span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-wide">Featured Collections</h2>
          </div>
          <Link href="/collections" className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/60 hover:text-gold transition-colors flex items-center gap-2 group">
            Explore All <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionLinks.map((collection, index) => (
            <Link key={index} href={`/collections?collection=${collection.handle}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
              <Image 
                src={collection.image} 
                alt={collection.name} 
                fill 
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              {/* Glass Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="lg-card p-6 flex items-center justify-between">
                  <h3 className="font-serif text-xl md:text-2xl text-foreground font-bold">{collection.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-gold text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
