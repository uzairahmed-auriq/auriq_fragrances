"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import NewsletterForm from "../newsletter/NewsletterForm";

export default function FooterNewsletter() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Heading — a dropdown toggle on mobile, a plain heading on desktop */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between lg:cursor-default"
        aria-expanded={open}
      >
        <h4 className="font-serif text-lg text-white">Newsletter</h4>
        <ChevronDown
          className={`w-5 h-5 text-white lg:hidden transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content — collapsed on mobile until toggled, always shown on desktop */}
      <div className={`${open ? "block" : "hidden"} lg:block mt-4 lg:mt-6`}>
        <p className="text-gray-300 text-sm mb-4">
          Subscribe to receive updates, access to exclusive deals, and more.
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
}
