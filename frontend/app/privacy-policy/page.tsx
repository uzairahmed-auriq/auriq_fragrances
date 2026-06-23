"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden py-24">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="container-lux max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Data & Security</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Privacy Policy</h1>
          </div>

          <div className="lg-card p-8 md:p-12 lg:p-16">
            <div className="prose prose-invert max-w-none text-foreground/80 font-medium tracking-wide text-sm md:text-base leading-loose">
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gold/5 border border-gold/20 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <div className="w-12 h-12 rounded-full lux-glass flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </div>
                <p className="text-foreground font-bold tracking-wide m-0">
                  Your privacy is our priority. We are committed to protecting your personal information and your right to privacy.
                </p>
              </div>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Information We Collect</h2>
              <p className="mb-6">
                We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, when you participate in activities on the website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use.
              </p>
              <ul className="list-none space-y-4 mb-8 pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span><strong>Personal Information Provided by You:</strong> We collect names, phone numbers, email addresses, mailing addresses, billing addresses, debit/credit card numbers, and other similar information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number and the security code associated with your payment instrument.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">How We Use Your Information</h2>
              <p className="mb-6">
                We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
              <ul className="list-none space-y-4 mb-8 pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>To facilitate account creation and logon process.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>To fulfill and manage your orders.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>To send administrative information to you.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Will Your Information Be Shared With Anyone?</h2>
              <p className="mb-6">
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, or Legal Obligations.
              </p>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Contact Us</h2>
              <p className="mb-6">
                If you have questions or comments about this notice, you may email us at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline transition-all">uzairahmed@auriqfragnaces.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
