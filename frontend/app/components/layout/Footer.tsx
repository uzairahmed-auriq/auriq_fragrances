import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "../newsletter/NewsletterForm";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-foreground/5 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.95) 0%, rgba(10,10,10,1) 100%)' }}>
      {/* Glass sheen overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.03) 0%, transparent 60%)' }}></div>
      
      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icon.svg" alt="Auriq Logo" width={48} height={48} className="w-12 h-12 object-cover rounded-full bg-white/5" />
              <h3 className="text-2xl font-serif tracking-widest font-bold text-white">AURIQ</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/collections" className="hover:text-gold transition-colors duration-300">All Collections</Link></li>
              <li><Link href="/collections?sort=best-sellers" className="hover:text-gold transition-colors duration-300">Best Sellers</Link></li>
              <li><Link href="/collections?sort=new-arrivals" className="hover:text-gold transition-colors duration-300">New Arrivals</Link></li>
              <li><Link href="/gift-sets" className="hover:text-gold transition-colors duration-300">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/contact" className="hover:text-gold transition-colors duration-300">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-gold transition-colors duration-300">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-gold transition-colors duration-300">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Newsletter</h4>
            <p className="text-white/40 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} Auriq. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="https://www.instagram.com/auriqfragrances?igsh=MXByeTJybmZhNnQxbQ==" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">Instagram</Link>
            <Link href="#" className="hover:text-gold transition-colors duration-300">Facebook</Link>
            <Link href="#" className="hover:text-gold transition-colors duration-300">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
