import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24 pt-20">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux max-w-4xl mx-auto">
          <div className="text-center mb-16 border-b border-foreground/10 pb-12">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Information</span>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold font-bold tracking-widest mb-6">Shipping Policy</h1>
          </div>

          <div className="flex flex-col gap-12 text-foreground/80 leading-relaxed tracking-wide font-medium">
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">1. Delivery Timeframes</h2>
              <p className="mb-4">
                We strive to process and dispatch all orders within 1-2 business days. Delivery times vary based on your location and the shipping method selected at checkout.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
                <li><strong className="text-foreground">Standard Domestic:</strong> 3-5 business days</li>
                <li><strong className="text-foreground">Express Domestic:</strong> 1-2 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">2. Shipping Rates</h2>
              <p className="mb-4">
                Shipping rates are calculated at checkout based on the weight of your order and your destination. We offer complimentary standard shipping on all domestic orders over Rs. 20,000.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">3. Tracking Your Order</h2>
              <p className="mb-4">
                Once your order has been dispatched, you will receive a confirmation email containing your tracking number and a link to monitor your shipment's progress.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">4. Damaged or Lost Items</h2>
              <p className="mb-4">
                While we take utmost care in packaging our luxury fragrances, if your item arrives damaged or goes missing during transit, please contact our concierge team at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline">uzairahmed@auriqfragnaces.com</a> within 48 hours of delivery.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
