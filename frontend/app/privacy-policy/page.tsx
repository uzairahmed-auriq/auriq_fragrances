import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24 pt-20">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux max-w-4xl mx-auto">
          <div className="text-center mb-16 border-b border-foreground/10 pb-12">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Information</span>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold font-bold tracking-widest mb-6">Privacy Policy</h1>
          </div>

          <div className="flex flex-col gap-12 text-foreground/80 leading-relaxed tracking-wide font-medium">
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">1. Introduction</h2>
              <p className="mb-4">
                Auriq respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy describes how we collect, use, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">2. Information We Collect</h2>
              <p className="mb-4">
                We collect information to provide a better, more personalized shopping experience. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
                <li><strong className="text-foreground">Personal Data:</strong> Name, email address, shipping/billing address, and phone number when you place an order.</li>
                <li><strong className="text-foreground">Payment Data:</strong> Secure payment information processed by our third-party payment gateways. We do not store your full credit card details.</li>
                <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our website, collected via cookies to improve performance and analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">3. How We Use Your Information</h2>
              <p className="mb-4">
                Your data is primarily used to fulfill your orders, communicate with you about your purchase, and provide customer support. With your explicit consent, we may also send you marketing communications regarding new luxury collections or exclusive offers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">4. Data Security</h2>
              <p className="mb-4">
                We implement robust security measures to maintain the safety of your personal information. All sensitive payment transactions are encrypted using Secure Socket Layer (SSL) technology and processed through secure gateways.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">5. Sharing Your Information</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you (e.g., shipping carriers), so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">6. Contact Us</h2>
              <p className="mb-4">
                If you have any questions regarding this Privacy Policy, please contact our data protection officer at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline">uzairahmed@auriqfragnaces.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
