import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Link from "next/link";

export default function GiftSetsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-[#050505] min-h-screen relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center mt-10">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase mb-6">
            Personalized Gift Sets
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
            Curate the perfect aromatic experience. Our bespoke gift sets are meticulously designed to leave a lasting impression, featuring hand-selected fragrances housed in luxurious, customizable packaging.
          </p>
          <div className="w-24 h-[1px] bg-gold mx-auto mb-16"></div>
        </section>

        {/* Details Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual element */}
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] border border-white/5 rounded-sm flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold to-transparent"></div>
                    {/* Placeholder for gift set image */}
                    <div className="text-center p-8 relative z-10">
                        <div className="w-20 h-20 border border-gold/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            <span className="text-gold text-3xl font-serif tracking-widest">A</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white tracking-widest uppercase mb-3 drop-shadow-md">Bespoke Collection</h3>
                        <p className="text-sm text-gray-400 font-light tracking-widest uppercase">Custom Engraving Available</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-serif text-white mb-6 uppercase tracking-wider">
                The Art of Gifting
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Elevate your gift-giving with Auriq's personalized sets. Whether for a corporate event, a special celebration, or an intimate gesture, our team will work with you to create a unique selection of fragrances that perfectly matches the recipient's tastes.
              </p>
              
              <ul className="space-y-4 mb-10 text-gray-300">
                <li className="flex items-start">
                  <span className="text-gold mr-3">✦</span>
                  <span><strong>Custom Selection:</strong> Choose from our entire library of niche and luxury perfumes.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">✦</span>
                  <span><strong>Personalized Packaging:</strong> Monogramming, custom ribbons, and premium presentation boxes.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">✦</span>
                  <span><strong>Expert Consultation:</strong> Work directly with our fragrance concierges to build the ideal set.</span>
                </li>
              </ul>

              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
                <h3 className="text-xl font-serif text-white mb-4 text-center">Inquire About Custom Sets</h3>
                <p className="text-gray-400 text-sm mb-8 text-center leading-relaxed">
                  Due to the highly customized nature of our gift sets, pricing varies based on your selection and personalization requirements. Please contact our concierge team for a custom quote.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="https://wa.me/923300383666?text=Hello,%20I%20am%20interested%20in%20a%20personalized%20Auriq%20gift%20set." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 px-8 py-3 tracking-widest text-sm uppercase font-medium"
                  >
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
