"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Store, CheckCircle, Clock, Image as ImageIcon, LayoutTemplate, Star, LayoutGrid, Save } from "lucide-react";
import Image from "next/image";
import Modal from "../../components/ui/Modal";

export default function AdminStorefront() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'promo' | 'featured' | 'bestsellers'>('carousel');
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePublish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const ads = [
    { 
      id: 1, 
      title: "Summer Sale 2026", 
      type: "Hero Banner", 
      status: "Active", 
      startDate: "Jun 01, 2026",
      endDate: "Jun 30, 2026",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2940&auto=format&fit=crop" 
    },
    { 
      id: 2, 
      title: "The Midnight Collection", 
      type: "Announcement Bar", 
      status: "Scheduled", 
      startDate: "Jul 01, 2026",
      endDate: "Jul 15, 2026",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop"
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2 flex items-center gap-3">
            <Store className="w-8 h-8 text-gold" />
            Storefront Editor
          </h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Customize your homepage layout, banners, and featured products.</p>
        </div>
        <button 
          onClick={handlePublish}
          disabled={isSaving}
          className="bg-gold/90 text-background px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-70"
        >
          {isSaving ? "Publishing..." : saveSuccess ? "Published!" : <><Save className="w-4 h-4" /> Publish Changes</>}
        </button>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-foreground/10 p-6 bg-foreground/[0.02]">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('carousel')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'carousel' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <ImageIcon className="w-4 h-4" /> Hero Carousel
            </button>
            <button 
              onClick={() => setActiveTab('promo')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'promo' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <LayoutTemplate className="w-4 h-4" /> Promo Blocks
            </button>
            <button 
              onClick={() => setActiveTab('featured')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'featured' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Featured Collection
            </button>
            <button 
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'bestsellers' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <Star className="w-4 h-4" /> Best Sellers
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-hidden">
          
          {/* CAROUSEL EDITOR */}
          {activeTab === 'carousel' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-serif font-bold text-foreground">Hero Carousel</h2>
                <button 
                  onClick={() => setIsSlideModalOpen(true)}
                  className="text-gold text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Slide
                </button>
              </div>
              
              <div className="overflow-x-auto border border-foreground/10 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                      <th className="p-4 font-bold">Slide Media</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Duration</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-10 rounded overflow-hidden bg-foreground/5 flex-shrink-0">
                              <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-foreground tracking-wide">{ad.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5
                            ${ad.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {ad.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {ad.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground/80 font-medium text-xs">{ad.startDate} - {ad.endDate}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-foreground/50 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROMO BLOCKS EDITOR */}
          {activeTab === 'promo' && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground mb-2">Promotional Blocks</h2>
                <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Manage the two side-by-side cards on the homepage.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Block 1 */}
                <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-5 bg-foreground/[0.02]">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Block 1 (Left)</h3>
                  
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-2">
                    <Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" alt="Preview" fill className="object-cover" />
                    <button className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center font-bold tracking-widest text-xs uppercase text-white backdrop-blur-sm">
                      Change Image
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
                    <input type="text" defaultValue="New Arrival" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
                    <input type="text" defaultValue="The Midnight Collection" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Link URL</label>
                    <input type="text" defaultValue="/collections?sort=new-arrivals" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                </div>

                {/* Block 2 */}
                <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-5 bg-foreground/[0.02]">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gold">Block 2 (Right)</h3>
                  
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-2">
                    <Image src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop" alt="Preview" fill className="object-cover" />
                    <button className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center font-bold tracking-widest text-xs uppercase text-white backdrop-blur-sm">
                      Change Image
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
                    <input type="text" defaultValue="Limited Edition" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
                    <input type="text" defaultValue="Summer Exclusives" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Link URL</label>
                    <input type="text" defaultValue="/collections?sort=best-sellers" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FEATURED / BEST SELLERS EDITOR */}
          {(activeTab === 'featured' || activeTab === 'bestsellers') && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    {activeTab === 'featured' ? 'Featured Collection' : 'Best Sellers'}
                  </h2>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1">Select up to 8 products to display</p>
                </div>
                <button 
                  onClick={() => setIsProductModalOpen(true)}
                  className="bg-foreground/5 border border-foreground/10 text-foreground px-4 py-2 rounded-lg text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase"
                >
                  Select Products
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Mock product selection blocks */}
                {[1,2,3,4].map((i) => (
                  <div key={i} className="border border-foreground/10 rounded-xl overflow-hidden group">
                    <div className="relative aspect-square bg-foreground/5">
                      <Image 
                        src={`https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                        alt="Product" 
                        fill 
                        className="object-cover"
                      />
                      <button className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3 bg-background">
                      <p className="text-xs font-bold text-foreground truncate">Luxury Perfume {i}</p>
                      <p className="text-[10px] text-foreground/50">Rs. 12,500</p>
                    </div>
                  </div>
                ))}
                
                {/* Add new block */}
                <button 
                  onClick={() => setIsProductModalOpen(true)}
                  className="border-2 border-dashed border-foreground/20 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all text-foreground/40"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Add Product</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isSlideModalOpen} onClose={() => setIsSlideModalOpen(false)} title="Add New Slide">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsSlideModalOpen(false); }}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Image URL</label>
            <input type="text" placeholder="https://..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Heading</label>
            <input type="text" placeholder="Summer Collection" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tagline</label>
            <input type="text" placeholder="Limited Edition" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
          </div>
          <button type="submit" className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4">
            Create Slide
          </button>
        </form>
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Select Products" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Search products..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-foreground/10 rounded-lg hover:border-gold transition-colors cursor-pointer group">
                <input type="checkbox" className="accent-gold w-4 h-4 cursor-pointer" />
                <div className="w-12 h-12 bg-foreground/5 rounded relative overflow-hidden flex-shrink-0">
                  <Image src={`https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&sig=${i}`} alt="Product" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground group-hover:text-gold transition-colors">Luxury Perfume {i}</span>
                  <span className="text-xs text-foreground/50">Rs. 12,500</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setIsProductModalOpen(false)} className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-foreground transition-colors">
            Save Selection
          </button>
        </div>
      </Modal>
    </div>
  );
}
