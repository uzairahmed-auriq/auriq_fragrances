"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, RefreshCw, LayoutTemplate, MessageSquareQuote, Stars, Image as ImageIcon } from "lucide-react";
import { adminSettingsService } from "../services/adminSettingsService";
import { adminAdService } from "../services/adminAdService";
import { adminTestimonialService } from "../services/adminTestimonialService";
import { adminProductService } from "../services/adminProductService";
import { useAdminToast } from "../context/AdminToastContext";

export default function HomepageCMS() {
  const { success, error } = useAdminToast();
  const [activeTab, setActiveTab] = useState<'announcements' | 'banners' | 'promo_cards' | 'featured'>('announcements');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  
  const [ads, setAds] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsData, adsData, testimonialsData, productsData] = await Promise.all([
        adminSettingsService.getSettingsByGroup('HOMEPAGE'),
        adminAdService.getAds(),
        adminTestimonialService.getAll().catch(() => []),
        adminProductService.getAll().catch(() => ({ data: [] }))
      ]);
      setSettings(settingsData);
      setAds(adsData || []);
      setTestimonials(testimonialsData || []);
      setAllProducts(productsData.data || []);
    } catch (err) {
      console.warn("Network or API Error:", err instanceof Error ? err.message : String(err));
      error("Failed to connect to the backend server.");
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(settingKey);
    try {
      const res = await adminSettingsService.uploadImage(file);
      if (res.success && res.url) {
        handleSettingChange(settingKey, res.url);
        success("Image uploaded successfully!");
      } else {
        error("Failed to upload image.");
      }
    } catch (err) {
      error("Error uploading image.");
    } finally {
      setUploadingImage(null);
      if (e.target) e.target.value = '';
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await adminSettingsService.updateSettings(settings, 'HOMEPAGE');
      success("Settings saved successfully!");
    } catch (err) {
      error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-foreground/10 bg-foreground/[0.02] p-4 overflow-y-auto">
        <h2 className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-4 px-4">Homepage Sections</h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'announcements' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Announcement Bar
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'banners' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <ImageIcon className="w-4 h-4" /> Banners
          </button>
          <button 
            onClick={() => setActiveTab('promo_cards')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'promo_cards' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <ImageIcon className="w-4 h-4" /> Promotional Cards
          </button>
          <button 
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${activeTab === 'featured' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5'}`}
          >
            <Stars className="w-4 h-4" /> Featured Collection
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Homepage CMS</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage content across the homepage</p>
            </div>
            
            {/* Global Save for Settings-based tabs */}
            {['announcements', 'banners', 'promo_cards', 'featured'].includes(activeTab) && (
              <button 
                onClick={saveSettings}
                disabled={isSaving}
                className="bg-gold text-background px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-gold/90 transition-all flex items-center gap-2 uppercase disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Publish Changes"}
              </button>
            )}
          </div>

          {/* Tab Content: PROMO CARDS */}
          {activeTab === 'promo_cards' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Promotional Cards</h3>
                <p className="text-sm text-foreground/60">Manage the two promotional boxes displayed inside the Hero section.</p>
                
                <div className="flex items-center gap-3 border-b border-foreground/10 pb-4 mb-6">
                  <input 
                    type="checkbox" 
                    id="promo_cards_enabled" 
                    checked={settings.PROMO_CARDS_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('PROMO_CARDS_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="promo_cards_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Promotional Cards</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Promo Card 1 */}
                  <div className="space-y-4 bg-foreground/[0.02] p-4 rounded-xl border border-foreground/5">
                    <h5 className="font-bold text-sm">Card 1</h5>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tag</label>
                      <input type="text" value={settings.PROMO1_TAG || ''} onChange={(e) => handleSettingChange('PROMO1_TAG', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. New Arrival" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Title</label>
                      <input type="text" value={settings.PROMO1_TITLE || ''} onChange={(e) => handleSettingChange('PROMO1_TITLE', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. The Midnight Collection" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Image Upload</label>
                      <div className="flex items-center gap-3">
                        {settings.PROMO1_IMAGE && (
                          <div className="w-12 h-12 rounded bg-foreground/10 overflow-hidden shrink-0 border border-foreground/20">
                            <img src={settings.PROMO1_IMAGE} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'PROMO1_IMAGE')} 
                            className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 cursor-pointer" 
                            disabled={uploadingImage === 'PROMO1_IMAGE'}
                          />
                          {uploadingImage === 'PROMO1_IMAGE' && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Button Text</label>
                      <input type="text" value={settings.PROMO1_BTN || ''} onChange={(e) => handleSettingChange('PROMO1_BTN', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. Discover Now" />
                    </div>
                  </div>

                  {/* Promo Card 2 */}
                  <div className="space-y-4 bg-foreground/[0.02] p-4 rounded-xl border border-foreground/5">
                    <h5 className="font-bold text-sm">Card 2</h5>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Tag</label>
                      <input type="text" value={settings.PROMO2_TAG || ''} onChange={(e) => handleSettingChange('PROMO2_TAG', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. Limited Edition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Title</label>
                      <input type="text" value={settings.PROMO2_TITLE || ''} onChange={(e) => handleSettingChange('PROMO2_TITLE', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. Summer Exclusives" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Image Upload</label>
                      <div className="flex items-center gap-3">
                        {settings.PROMO2_IMAGE && (
                          <div className="w-12 h-12 rounded bg-foreground/10 overflow-hidden shrink-0 border border-foreground/20">
                            <img src={settings.PROMO2_IMAGE} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'PROMO2_IMAGE')} 
                            className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 cursor-pointer" 
                            disabled={uploadingImage === 'PROMO2_IMAGE'}
                          />
                          {uploadingImage === 'PROMO2_IMAGE' && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Button Text</label>
                      <input type="text" value={settings.PROMO2_BTN || ''} onChange={(e) => handleSettingChange('PROMO2_BTN', e.target.value)} className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" placeholder="e.g. Shop Sale" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Announcement Bar</h3>
                
                <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                  <input 
                    type="checkbox" 
                    id="announcement_enabled" 
                    checked={settings.ANNOUNCEMENT_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('ANNOUNCEMENT_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="announcement_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Announcement Bar</label>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Announcement Text</label>
                    <input 
                      type="text" 
                      value={settings.ANNOUNCEMENT_TEXT || ''}
                      onChange={(e) => handleSettingChange('ANNOUNCEMENT_TEXT', e.target.value)}
                      placeholder="e.g. Free shipping on all orders over Rs. 5000"
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Announcement Link (Optional)</label>
                    <input 
                      type="text" 
                      value={settings.ANNOUNCEMENT_LINK || ''}
                      onChange={(e) => handleSettingChange('ANNOUNCEMENT_LINK', e.target.value)}
                      placeholder="e.g. /collections/sale"
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: FEATURED COLLECTION */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold">Featured Collection</h3>
                
                <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                  <input 
                    type="checkbox" 
                    id="featured_enabled" 
                    checked={settings.FEATURED_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('FEATURED_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="featured_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Featured Collection</label>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Section Title</label>
                    <input 
                      type="text" 
                      value={settings.FEATURED_TITLE || ''}
                      onChange={(e) => handleSettingChange('FEATURED_TITLE', e.target.value)}
                      placeholder="e.g. Featured Collections"
                      className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm" 
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-foreground/10">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Selected Products (Max 12)</label>
                      <span className="text-xs font-bold text-foreground/70">
                        {settings.FEATURED_PRODUCT_IDS ? settings.FEATURED_PRODUCT_IDS.split(',').filter(Boolean).length : 0} / 12
                      </span>
                    </div>
                    
                    {/* List of selected products */}
                    <div className="space-y-2">
                      {(settings.FEATURED_PRODUCT_IDS ? settings.FEATURED_PRODUCT_IDS.split(',').filter(Boolean) : []).map((idStr, index, arr) => {
                        const prodId = parseInt(idStr);
                        const product = allProducts.find(p => p.id === prodId);
                        
                        return (
                          <div key={`${prodId}-${index}`} className="flex items-center justify-between p-3 bg-background border border-foreground/10 rounded-lg">
                            <span className="text-sm font-medium">{product ? product.name : `Product ID: ${prodId}`}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  if (index > 0) {
                                    const newArr = [...arr];
                                    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
                                    handleSettingChange('FEATURED_PRODUCT_IDS', newArr.join(','));
                                  }
                                }}
                                disabled={index === 0}
                                className="p-1 hover:bg-foreground/5 rounded text-foreground/50 disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => {
                                  if (index < arr.length - 1) {
                                    const newArr = [...arr];
                                    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
                                    handleSettingChange('FEATURED_PRODUCT_IDS', newArr.join(','));
                                  }
                                }}
                                disabled={index === arr.length - 1}
                                className="p-1 hover:bg-foreground/5 rounded text-foreground/50 disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button 
                                onClick={() => {
                                  const newArr = arr.filter((_, i) => i !== index);
                                  handleSettingChange('FEATURED_PRODUCT_IDS', newArr.join(','));
                                }}
                                className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-foreground/50 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add new product dropdown */}
                    <div className="flex gap-2 mt-4">
                      <select 
                        id="new_featured_product"
                        className="flex-1 bg-background text-foreground border border-foreground/20 rounded-lg px-4 py-2 focus:border-gold outline-none text-sm"
                      >
                        <option className="bg-background text-foreground" value="">-- Select a product to add --</option>
                        {allProducts.map(p => (
                          <option className="bg-background text-foreground" key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        {allProducts.length === 0 && (
                          <option className="bg-background text-foreground" disabled>No active products found</option>
                        )}
                      </select>
                      <button 
                        onClick={() => {
                          const select = document.getElementById('new_featured_product') as HTMLSelectElement;
                          const val = select.value;
                          if (val) {
                            const currentIds = settings.FEATURED_PRODUCT_IDS ? settings.FEATURED_PRODUCT_IDS.split(',').filter(Boolean) : [];
                            if (currentIds.length >= 12) {
                              error("Maximum 12 products allowed.");
                              return;
                            }
                            if (!currentIds.includes(val)) {
                              handleSettingChange('FEATURED_PRODUCT_IDS', [...currentIds, val].join(','));
                              select.value = '';
                            } else {
                              error("Product is already in the list.");
                            }
                          }
                        }}
                        className="bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: BANNERS (READ-ONLY DISPLAY) */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold">Current Banners</h3>
                  <p className="text-sm text-foreground/60">Banners managed globally via the Ads menu.</p>
                </div>
                <a href="/admin/ads" className="bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Manage Ads
                </a>
              </div>

              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="banners_enabled" 
                    checked={settings.BANNERS_ENABLED !== 'false'}
                    onChange={(e) => handleSettingChange('BANNERS_ENABLED', e.target.checked.toString())}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="banners_enabled" className="text-sm font-bold text-foreground cursor-pointer">Enable Banners Section</label>
                </div>
              </div>

              {ads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ads.map(ad => (
                    <div key={ad.id} className="relative rounded-lg overflow-hidden border border-foreground/10 h-32 flex items-center justify-center bg-foreground/5">
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                      ) : null}
                      <div className="relative z-10 text-center">
                        <span className="font-bold block">{ad.title}</span>
                        <span className="text-xs uppercase tracking-widest">{ad.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 border border-dashed border-foreground/20 rounded-xl text-foreground/50 font-medium">
                  No active banners found.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
