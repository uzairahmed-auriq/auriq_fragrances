import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "../newsletter/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5">
      <div className="container-lux">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/icon.svg" alt="Auriq Logo" width={48} height={48} className="w-12 h-12 object-cover rounded-full bg-white/5" />
              <h3 className="text-2xl font-serif tracking-widest font-bold text-white">AURIQ</h3>
            </div>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/collections" className="hover:text-gold transition-colors">All Collections</Link></li>
              <li><Link href="/collections?sort=best-sellers" className="hover:text-gold transition-colors">Best Sellers</Link></li>
              <li><Link href="/collections?sort=new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link></li>
              <li><Link href="/gift-sets" className="hover:text-gold transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-gold transition-colors">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Auriq. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="https://www.instagram.com/auriqfragrances?igsh=MXByeTJybmZhNnQxbQ==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
