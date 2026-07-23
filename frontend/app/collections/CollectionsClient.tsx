"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCardActions from "../components/home/ProductCardActions";

const CollectionProductCard = ({ product }: { product: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images?.length > 0 ? product.images : [{ image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" }];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const price = product.variants?.[0]?.price || 0;
  const currentImage = images[currentImageIndex]?.image_url;

  return (
    <div
      className="group relative flex flex-col lux-glass-card p-3 sm:p-5 active:scale-[0.98] transition-transform duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-3 sm:mb-6 bg-background z-10 shadow-2xl transform-gpu backface-hidden">
          {images.map((img: any, idx: number) => (
            <Image
              key={idx}
              src={img.image_url}
              alt={`${product.name} - ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-1000 ease-in-out transform-gpu will-change-transform will-change-opacity ${
                idx === currentImageIndex 
                  ? 'opacity-90 group-hover:opacity-100 group-hover:scale-110 z-10' 
                  : 'opacity-0 group-hover:scale-110 z-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="pointer-events-auto h-full w-full">
              <ProductCardActions productId={product.id} variantId={product.variants?.[0]?.id} />
            </div>
          </div>
        </Link>

        <div className="flex flex-col text-center relative z-10 px-1 sm:px-2">
          <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.2em] mb-1 sm:mb-3 font-bold">{product.brand || 'Auriq'}</span>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-serif text-sm sm:text-xl text-foreground mb-1 sm:mb-2 font-bold drop-shadow-md hover:text-gold transition-colors leading-tight">{product.name}</h3>
          </Link>
          <span className="text-foreground/80 text-xs sm:text-sm tracking-wide font-medium">Rs. {Number(price).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function CollectionsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortQuery = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState(sortQuery);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  
  const [products] = useState<any[]>(initialProducts);
  const [search, setSearch] = useState(searchQuery);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [familyFilters, setFamilyFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const toggleArrayFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const matchesPriceRange = (price: number, label: string) => {
    if (label === 'Under Rs. 10,000') return price < 10000;
    if (label === 'Rs. 10,000 - Rs. 15,000') return price >= 10000 && price <= 15000;
    if (label === 'Rs. 15,000 - Rs. 20,000') return price > 15000 && price <= 20000;
    if (label === 'Over Rs. 20,000') return price > 20000;
    return false;
  };

  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (sortQuery) setSortBy(sortQuery);
  }, [sortQuery]);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  // Reset to first page whenever filters or sort change
  useEffect(() => {
    setVisibleCount(12);
  }, [search, priceFilters, familyFilters, genderFilters, brandFilters, sortBy]);

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setIsSortDropdownOpen(false);
    router.push(`/collections?sort=${val}`);
  };

  const getSortLabel = (val: string) => {
    switch(val) {
      case 'new-arrivals': return 'New Arrivals';
      case 'best-sellers': return 'Best Sellers';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Featured';
    }
  };

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const price = Number(p.variants?.[0]?.price || 0);
    const matchesPrice = priceFilters.length === 0 || priceFilters.some(label => matchesPriceRange(price, label));
    const matchesFamily = familyFilters.length === 0 || familyFilters.some(f => (p.fragrance_type || "").toLowerCase() === f.toLowerCase());
    const matchesGender = genderFilters.length === 0 || genderFilters.some(g => (p.gender || "").toLowerCase() === g.toLowerCase());
    const matchesBrand = brandFilters.length === 0 || brandFilters.some(b => (p.brand || "").toLowerCase() === b.toLowerCase());
    return matchesSearch && matchesPrice && matchesFamily && matchesGender && matchesBrand;
  }), [products, search, priceFilters, familyFilters, genderFilters, brandFilters]);

  const sortedProducts = useMemo(() => [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.variants?.[0]?.price || 0);
    const priceB = Number(b.variants?.[0]?.price || 0);
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'new-arrivals') return b.id - a.id;
    if (sortBy === 'best-sellers') return a.id - b.id;
    return 0;
  }), [filteredProducts, sortBy]);

  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount]);

  const [expandedFilters, setExpandedFilters] = useState({
    price: false,
    family: false,
    gender: false,
    occasion: false,
    brand: false,
  });

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setExpandedFilters({ price: true, family: true, gender: true, occasion: true, brand: true });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleFilter = (key: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterSidebar = (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-serif text-gradient-gold font-bold tracking-widest">Filters</h3>
        <button onClick={() => { setPriceFilters([]); setGenderFilters([]); setFamilyFilters([]); }} className="text-[10px] text-foreground/50 hover:text-foreground uppercase tracking-[0.2em] transition-colors">Clear All</button>
      </div>

      {/* Price Filter */}
      <div className="border-t border-foreground/10 pt-6">
        <button
          className="flex w-full items-center justify-between text-foreground hover:text-gold transition-colors"
          onClick={() => toggleFilter('price')}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-bold">Price</span>
          {expandedFilters.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expandedFilters.price ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pt-5">
              {['Under Rs. 10,000', 'Rs. 10,000 - Rs. 15,000', 'Rs. 15,000 - Rs. 20,000', 'Over Rs. 20,000'].map(label => (
                <label key={label} className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" checked={priceFilters.includes(label)} onChange={() => toggleArrayFilter(priceFilters, setPriceFilters, label)} className="accent-[#d4af37] w-4 h-4 bg-transparent border-foreground/30 cursor-pointer" />
                  <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors tracking-wide font-semibold">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="border-t border-foreground/10 pt-6">
        <button
          className="flex w-full items-center justify-between text-foreground hover:text-gold transition-colors"
          onClick={() => toggleFilter('family')}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-bold">Type</span>
          {expandedFilters.family ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expandedFilters.family ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pt-5">
              {[{ label: 'Perfume', value: 'PERFUME' }, { label: 'Attar', value: 'ATTAR' }].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" checked={familyFilters.includes(value)} onChange={() => toggleArrayFilter(familyFilters, setFamilyFilters, value)} className="accent-[#d4af37] w-4 h-4 bg-transparent border-foreground/30 cursor-pointer" />
                  <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors tracking-wide font-semibold">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gender Filter */}
      <div className="border-t border-foreground/10 pt-6">
        <button
          className="flex w-full items-center justify-between text-foreground hover:text-gold transition-colors"
          onClick={() => toggleFilter('gender')}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-bold">Gender</span>
          {expandedFilters.gender ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expandedFilters.gender ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pt-5">
              {['Men', 'Women', 'Unisex'].map(label => {
                const genderValue = label === 'Men' ? 'MALE' : label === 'Women' ? 'FEMALE' : 'UNISEX';
                return (
                  <label key={label} className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" checked={genderFilters.includes(genderValue)} onChange={() => toggleArrayFilter(genderFilters, setGenderFilters, genderValue)} className="accent-[#d4af37] w-4 h-4 bg-transparent border-foreground/30 cursor-pointer" />
                    <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors tracking-wide font-semibold">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-16 md:pt-24">
          {/* Page Header */}
          <div className="flex flex-col items-center justify-center text-center mb-12 border-b border-foreground/10 pb-12">
            <span className="text-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4">Discover</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gradient-gold font-bold tracking-widest mb-6">The Collection</h1>
            <p className="max-w-2xl text-foreground/60 text-sm md:text-base leading-relaxed tracking-wide px-4">
              Explore our complete portfolio of luxury fragrances. Each scent is a masterpiece, crafted with the finest ingredients to evoke profound emotions.
            </p>
          </div>

          {/* Main Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Mobile Filter Toggle */}
            <div className="w-full flex justify-between items-center lg:hidden border-b border-foreground/10 pb-4">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-sm font-medium tracking-widest uppercase border border-foreground/20 px-6 py-3 rounded-none backdrop-blur-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center gap-2 relative">
                <span className="text-foreground/50 text-[10px] uppercase tracking-widest">Sort By:</span>
                <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-xs font-bold tracking-wider uppercase"
                >
                  {getSortLabel(sortBy)} <ChevronDown className="w-3 h-3" />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded shadow-xl z-50">
                    {['featured', 'new-arrivals', 'best-sellers', 'price-low', 'price-high'].map(option => (
                      <button 
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors ${sortBy === option ? 'text-gold font-bold' : 'text-foreground'}`}
                      >
                        {getSortLabel(option)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sidebar */}
            {isDesktopFiltersOpen && (
              <div className="hidden lg:block w-1/4 sticky top-32">
                {filterSidebar}
              </div>
            )}

            {/* Mobile Sidebar Drawer */}
            {isMobileFiltersOpen && (
              <div className="fixed inset-0 z-[100] lg:hidden flex">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                <div className="relative w-[85%] max-w-sm bg-background h-full flex flex-col border-r border-foreground/10 shadow-2xl">
                  {/* Sticky header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/10 flex-shrink-0">
                    <span className="text-gold font-serif text-xl font-bold tracking-widest">Filters</span>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/20 text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Scrollable filter content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {filterSidebar}
                  </div>
                  {/* Fixed bottom — View Results button */}
                  <div className="px-6 py-4 border-t border-foreground/10 flex-shrink-0">
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="w-full bg-gold text-background py-4 text-xs font-bold tracking-[0.3em] uppercase"
                    >
                      VIEW RESULTS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid Area */}
            <div className={`w-full ${isDesktopFiltersOpen ? 'lg:w-3/4' : 'lg:w-full'} flex flex-col transition-[width] duration-300`}>
              
              {/* Desktop Top Toolbar */}
              <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-foreground/5 relative">
                <button 
                  onClick={() => setIsDesktopFiltersOpen(!isDesktopFiltersOpen)}
                  className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase"
                >
                  <Filter className="w-4 h-4" />
                  {isDesktopFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] font-bold">Sort By:</span>
                  <button 
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase"
                  >
                    {getSortLabel(sortBy)} <ChevronDown className="w-4 h-4 text-gold" />
                  </button>
                  {isSortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded shadow-xl z-50">
                      {['featured', 'new-arrivals', 'best-sellers', 'price-low', 'price-high'].map(option => (
                        <button 
                          key={option}
                          onClick={() => handleSortChange(option)}
                          className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-gold/10 transition-colors ${sortBy === option ? 'text-gold font-bold' : 'text-foreground'}`}
                        >
                          {getSortLabel(option)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid - 3 columns on desktop since sidebar takes 1/4 */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12">
                {visibleProducts.map((product) => (
                  <CollectionProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {sortedProducts.length > 0 && sortedProducts.slice(0, visibleCount).length > 0 && (
                <div className="flex justify-center mt-24">
                  {visibleCount < sortedProducts.length && (
                  <button onClick={() => setVisibleCount(v => v + 12)} className="px-12 py-4 border border-foreground/20 text-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all duration-500 text-xs uppercase shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    Load More ({sortedProducts.length - visibleCount} remaining)
                  </button>
                )}
                </div>
              )}

            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
