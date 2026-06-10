import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24 pt-20">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux max-w-4xl mx-auto">
          <div className="text-center mb-16 border-b border-foreground/10 pb-12">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Information</span>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold font-bold tracking-widest mb-6">Return Policy</h1>
          </div>

          <div className="flex flex-col gap-12 text-foreground/80 leading-relaxed tracking-wide font-medium">
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">1. Our Philosophy</h2>
              <p className="mb-4">
                At Auriq, we are dedicated to crafting fragrances of the highest quality. We understand that purchasing luxury perfumes online can be challenging. If you are not completely satisfied with your purchase, we are here to help.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">2. Eligibility for Returns</h2>
              <p className="mb-4">
                We accept returns within 14 days of the delivery date. To be eligible for a return, the fragrance must be:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
                <li>Unused and in the exact same condition that you received it.</li>
                <li>In its original, unopened packaging with all cellophane seals intact.</li>
                <li>Accompanied by the original receipt or proof of purchase.</li>
              </ul>
              <p className="mt-4 text-gold/80 italic text-sm">
                Note: For hygiene and quality control reasons, we cannot accept returns on perfumes that have been opened or sprayed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">3. The Return Process</h2>
              <p className="mb-4">
                To initiate a return, please contact our concierge team at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline">uzairahmed@auriqfragnaces.com</a>. Please provide your order number and the reason for the return. Our team will provide you with a Return Authorization (RA) number and instructions on how and where to send your package.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">4. Refunds</h2>
              <p className="mb-4">
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed automatically to your original method of payment within 5-10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">5. Exchanges</h2>
              <p className="mb-4">
                We only replace items if they are defective or damaged during transit. If you need to exchange a damaged item for the same fragrance, please contact us immediately upon receipt.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
