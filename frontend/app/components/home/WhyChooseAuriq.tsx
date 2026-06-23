"use client";

import { Leaf, Award, ShieldCheck, Clock } from "lucide-react";

export default function WhyChooseAuriq() {
  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Master Perfumery",
      description: "Crafted by world-renowned artisan perfumers using time-honored distillation techniques."
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Rare Ingredients",
      description: "Sourced globally from sustainable harvests to ensure unparalleled purity and longevity."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Lasting Impressions",
      description: "High perfume oil concentration guarantees a sillage that lingers elegantly throughout the day."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Authenticity Assured",
      description: "Every bottle is a certified original, meticulously inspected for flawless presentation."
    }
  ];

  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden">
      {/* Dynamic Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="container-lux relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">The Auriq Standard</span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-wide">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="lg-stat-card p-10 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full lux-glass flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif text-foreground font-bold mb-4">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed font-medium tracking-wide">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
