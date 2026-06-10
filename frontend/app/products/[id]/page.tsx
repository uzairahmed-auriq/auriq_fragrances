"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingBag, ArrowLeft, ChevronDown, ChevronUp, Check, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// Combined mock DB encompassing BestSellers, Featured, and Collections
const mockDatabase = [
  { id: 1, name: "Royal Oud", brand: "Auriq", price: "Rs. 15,000", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop", description: "A majestic blend of rich oud wood, delicate rose, and warm amber. Royal Oud evokes the opulence of palatial evenings and timeless sophistication.", topNotes: "Saffron, Nutmeg, Lavender", heartNotes: "Agarwood (Oud), Rose, Amber", baseNotes: "Musk, Patchouli, Sandalwood" },
  { id: 2, name: "Tuscan Leather", brand: "Auriq", price: "Rs. 12,800", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop", description: "Raw, refined, and sensual. An intoxicating leather fragrance that perfectly balances primal animalic notes with elegant florals.", topNotes: "Raspberry, Saffron, Thyme", heartNotes: "Olibanum, Jasmine", baseNotes: "Leather, Suede, Amber, Wood" },
  { id: 3, name: "Baccarat Rouge", brand: "Auriq", price: "Rs. 18,200", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop", description: "A luminous and highly condensed olfactory signature. Floral meets woody breeze in an unforgettable, poetic alchemy.", topNotes: "Jasmine, Saffron", heartNotes: "Amberwood, Ambergris", baseNotes: "Fir Resin, Cedar" },
  { id: 4, name: "Aventus", brand: "Auriq", price: "Rs. 14,000", image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop", description: "Celebrating strength, power, and success. A masterful blend of fruity freshness and woody depth.", topNotes: "Pineapple, Bergamot, Black Currant, Apple", heartNotes: "Birch, Patchouli, Moroccan Jasmine, Rose", baseNotes: "Musk, Oakmoss, Ambergris, Vanilla" },
  { id: 5, name: "Oud Wood", brand: "Auriq", price: "Rs. 16,500", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop", description: "Rare, exotic, and distinctive. One of the most precious and expensive ingredients in a perfumer's arsenal.", topNotes: "Rosewood, Cardamom, Chinese Pepper", heartNotes: "Oud Wood, Sandalwood, Vetiver", baseNotes: "Tonka Bean, Vanilla, Amber" },
  { id: 6, name: "Santal 33", brand: "Auriq", price: "Rs. 13,500", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop", description: "An intoxicating fragrance that captures the spirit of the American West. A woody, aromatic scent that is both rugged and elegant.", topNotes: "Cardamom, Iris, Violet", heartNotes: "Australian Sandalwood, Cedarwood", baseNotes: "Leather, Musk, Amber" },
  { id: 7, name: "Lost Cherry", brand: "Auriq", price: "Rs. 19,000", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop", description: "A full-bodied journey into the once-forbidden. A contrasting scent that reveals a tempting dichotomy of playful, candy-like gleam on the outside and luscious flesh on the inside.", topNotes: "Sour Cherry, Liquor, Almond", heartNotes: "Plum, Turkish Rose, Jasmine Sambac", baseNotes: "Tonka Bean, Vanilla, Cinnamon, Sandalwood, Cedar" },
  { id: 8, name: "Neroli Portofino", brand: "Auriq", price: "Rs. 11,500", image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop", description: "Vibrant, sparkling, and transportive. Capturing the cool breezes, sparkling clear water, and lush foliage of the Italian Riviera.", topNotes: "Bergamot, Mandarin Orange, Lemon, Bitter Orange", heartNotes: "African Orange Flower, Neroli, Jasmine", baseNotes: "Amber, Angelica, Ambrette" },
  { id: 9, name: "Oud Royale", brand: "Auriq", price: "Rs. 12,500", image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop", description: "A majestic expression of the rarest oud. Deep, resinous, and uncompromisingly luxurious.", topNotes: "Lemon, Pink Pepper", heartNotes: "Angelica, Galbanum, Cedar", baseNotes: "Agarwood (Oud), Sandalwood, Musk" },
  { id: 10, name: "Velvet Rose", brand: "Auriq", price: "Rs. 9,800", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop", description: "Darkest Damask rose. Rich and textural, wrapped with smoky oud wood. Spiked with clove, decadent with praline.", topNotes: "Clove", heartNotes: "Damask Rose", baseNotes: "Oud Wood, Praline" },
  { id: 11, name: "Midnight Amber", brand: "Auriq", price: "Rs. 14,200", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop", description: "A seductive oriental fragrance. Deep amber interwoven with sweet vanilla and dark resins.", topNotes: "Bergamot, Incense", heartNotes: "Rose, Patchouli", baseNotes: "Amber, Vanilla, Labdanum" },
  { id: 12, name: "Bleu De Noir", brand: "Auriq", price: "Rs. 10,500", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2953&auto=format&fit=crop", description: "A woody aromatic fragrance for the modern man. Fresh, clean, and profoundly sensual.", topNotes: "Grapefruit, Lemon, Mint, Pink Pepper", heartNotes: "Ginger, Nutmeg, Jasmine, Iso E Super", baseNotes: "Incense, Vetiver, Cedar, Sandalwood, Patchouli, Labdanum, White Musk" }
];

export default function ProductPage() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : null;
  
  // Find product or default to the first one if ID not found in mock array
  const product = mockDatabase.find(p => p.id === id) || mockDatabase[0];

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'details'>('notes');

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        {/* Back Navigation */}
        <div className="relative z-10 container-lux pt-12 pb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-xs font-bold tracking-[0.2em] uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </button>
        </div>

        <div className="relative z-10 container-lux pb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            
            {/* Left: Product Image */}
            <div className="w-full lg:w-1/2 sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden lux-glass-card p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-background">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90 transition-all duration-1000 hover:scale-110 hover:opacity-100"
                    priority
                  />
                  {/* Subtle vignette over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-12">
              
              <div className="mb-8 border-b border-foreground/10 pb-8">
                <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{product.brand}</span>
                <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-wide mb-4 drop-shadow-md">{product.name}</h1>
                <p className="text-2xl text-foreground/80 font-medium tracking-wide mb-6">{product.price}</p>
                <p className="text-foreground/60 leading-relaxed tracking-wide text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-foreground/20 rounded-full lux-glass-card">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-5 py-3 text-foreground hover:text-gold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-foreground font-bold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-5 py-3 text-foreground hover:text-gold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button className="flex-1 bg-gold/90 backdrop-blur-md text-background py-4 px-8 rounded-full font-bold tracking-widest hover:bg-foreground hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3">
                    <ShoppingBag className="w-5 h-5" />
                    ADD TO CART
                  </button>
                  <button className="p-4 border border-foreground/20 rounded-full text-foreground hover:text-gold hover:border-gold transition-colors lux-glass-card">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mb-12 border-y border-foreground/10 py-8">
                <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Authentic</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70 border-x border-foreground/10">
                  <Truck className="w-6 h-6 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70">
                  <RefreshCcw className="w-6 h-6 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Free Returns</span>
                </div>
              </div>

              {/* Tabs: Notes & Details */}
              <div className="flex flex-col">
                <div className="flex gap-8 border-b border-foreground/10 mb-8">
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative ${activeTab === 'notes' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    Fragrance Notes
                    {activeTab === 'notes' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"></span>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative ${activeTab === 'details' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    Details & Ingredients
                    {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"></span>}
                  </button>
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 'notes' ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Top Notes</span>
                        <p className="text-foreground tracking-wide">{product.topNotes}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Heart Notes</span>
                        <p className="text-foreground tracking-wide">{product.heartNotes}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Base Notes</span>
                        <p className="text-foreground tracking-wide">{product.baseNotes}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 text-sm text-foreground/70 leading-loose tracking-wide">
                      <p>
                        <strong>Application:</strong> Spray onto pulse points (wrists, neck, and behind ears) for best performance. Do not rub the fragrance into the skin as this will alter how the fragrance develops.
                      </p>
                      <p>
                        <strong>Ingredients:</strong> Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Citral, Farnesol, Benzyl Benzoate, Benzyl Salicylate.
                      </p>
                      <p className="text-[10px] text-foreground/40 mt-4 uppercase tracking-widest">
                        Note: Ingredients are subject to change. For the most complete and up-to-date list of ingredients, refer to the product packaging.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
