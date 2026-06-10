import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactFeedback from "../components/home/ContactFeedback";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden">
        {/* We can use the existing ContactFeedback component as the core of this page */}
        <div className="pt-20">
          <ContactFeedback />
        </div>
      </main>
      <Footer />
    </>
  );
}
