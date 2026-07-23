"use client";

import { Award, ShieldCheck, Truck, Smile } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function WhyChooseAuriq() {
  const settings = useSettings();

  const title = settings.WHY_CHOOSE_TITLE || "The Auriq Standard";

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: settings.WHY_CHOOSE_F1_TITLE || "Premium Quality",
      description: settings.WHY_CHOOSE_F1_DESC || "Sourced from the finest ingredients worldwide, ensuring an unparalleled olfactory experience.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: settings.WHY_CHOOSE_F2_TITLE || "Authentic Fragrances",
      description: settings.WHY_CHOOSE_F2_DESC || "100% genuine products crafted by master perfumers with a rich heritage in scent making.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: settings.WHY_CHOOSE_F3_TITLE || "Fast Delivery",
      description: settings.WHY_CHOOSE_F3_DESC || "Complimentary express shipping on all orders, delivered in pristine condition to your doorstep.",
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: "Customer Satisfaction",
      description: "Dedicated concierge service ready to assist you in finding your perfect signature scent.",
    },
  ];

  return (
    <section className="py-32 bg-perfume-main relative overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="text-center mb-24">
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold mb-8 font-bold tracking-wide drop-shadow-md">{title}</h2>
          <div className="w-24 h-[2px] bg-gold mx-auto shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group lux-glass-card p-10">
              <div className="flex flex-col items-center">
                <div className="relative z-10 w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-background group-hover:border-gold transition-all duration-700 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                  {feature.icon}
                </div>
                <h3 className="relative z-10 text-lg font-serif text-foreground mb-4 font-bold tracking-wide drop-shadow-md">{feature.title}</h3>
                <p className="relative z-10 text-sm text-foreground/80 leading-loose max-w-xs font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
