"use client";

import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Printer } from "lucide-react";
import { getOrderById } from "../../services/orderService";
import { useParams } from "next/navigation";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="print:hidden"><Header /></div>
        <main className="flex-1 w-full bg-perfume-main min-h-screen flex items-center justify-center">
          <div className="text-gold">Loading Invoice...</div>
        </main>
        <div className="print:hidden"><Footer /></div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <div className="print:hidden"><Header /></div>
        <main className="flex-1 w-full bg-perfume-main min-h-screen flex items-center justify-center">
          <div className="text-red-400">Invoice not found.</div>
        </main>
        <div className="print:hidden"><Footer /></div>
      </>
    );
  }

  return (
    <>
      {/* @page rule removes browser-added URL and page-number chrome from the PDF */}
      <style>{`@page { size: A4; margin: 15mm; } @media print { body * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>

      <div className="print:hidden"><Header /></div>

      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24 pt-32 print:bg-white print:min-h-0 print:pt-0 print:pb-0 print:overflow-visible">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0 print:hidden"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 print:px-0 print:max-w-none">
          <div className="lux-glass-card p-12 text-foreground bg-background print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">

            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b border-foreground/10 pb-8 print:border-black/20">
              <div>
                <h1 className="text-3xl font-serif text-gold tracking-widest font-bold uppercase mb-2 print:text-black">AURIQ</h1>
                <p className="text-sm text-foreground/60 tracking-wide print:text-gray-600">
                  Sindh madrasa tul islamia<br />Garikhata Karachi, 74000
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold tracking-widest mb-1">INVOICE</h2>
                <p className="text-sm text-foreground/60 tracking-wide print:text-gray-600">
                  Order #AUR-{order.id}<br />{new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-12">
              <h3 className="text-sm font-bold tracking-widest text-gold uppercase mb-2 print:text-black">Billed To</h3>
              <p className="text-sm text-foreground/80 tracking-wide print:text-gray-800">
                {order.user?.name || order.guest_name || "Guest Customer"}<br />
                {order.user?.email || order.guest_email || ""}
                {(order.shipping_street || order.shipping_city) && (
                  <>
                    <br /><span className="block mt-2">Shipping Address:</span>
                    <span className="text-xs text-foreground/60 print:text-gray-600">
                      {[order.shipping_street, order.shipping_city, order.shipping_province, order.shipping_postal].filter(Boolean).join(", ")}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Items */}
            <div className="w-full mb-12">
              <div className="grid grid-cols-4 border-b border-foreground/20 pb-4 mb-4 text-xs font-bold tracking-widest uppercase text-foreground/60 print:border-black/20 print:text-gray-600">
                <div className="col-span-2">Item</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Amount</div>
              </div>

              {order.items?.map((item: any) => (
                <div key={item.id} className="grid grid-cols-4 mb-4 text-sm font-medium tracking-wide print:text-black">
                  <div className="col-span-2">{item.item_name || item.product?.name || 'Unknown Product'}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">Rs. {Number(item.total_price).toLocaleString()}</div>
                </div>
              ))}

              <div className="grid grid-cols-4 border-t border-foreground/10 pt-4 text-sm font-medium tracking-wide print:border-black/10 print:text-black">
                <div className="col-span-3 text-right text-foreground/60 print:text-gray-600">Subtotal:</div>
                <div className="text-right">Rs. {Number(order.subtotal).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 mt-2 text-sm font-medium tracking-wide print:text-black">
                <div className="col-span-3 text-right text-foreground/60 print:text-gray-600">Shipping:</div>
                <div className="text-right text-gold print:text-black">
                  {Number(order.shipping_fee) === 0 ? "Free" : `Rs. ${Number(order.shipping_fee).toLocaleString()}`}
                </div>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="grid grid-cols-4 mt-2 text-sm font-medium tracking-wide print:text-black">
                  <div className="col-span-3 text-right text-foreground/60 print:text-gray-600">
                    Discount{order.discount_code ? ` (${order.discount_code})` : ""}:
                  </div>
                  <div className="text-right text-green-500 print:text-green-700">
                    -Rs. {Number(order.discount_amount).toLocaleString()}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 mt-4 text-lg font-bold tracking-widest border-t border-foreground/20 pt-4 print:border-black/20 print:text-black">
                <div className="col-span-3 text-right text-gold print:text-black">Total:</div>
                <div className="text-right">Rs. {Number(order.total).toLocaleString()}</div>
              </div>
            </div>

            {/* Print button — hidden when printing */}
            <div className="flex justify-center gap-4 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-transparent border border-foreground/20 text-foreground py-3 px-8 text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden"><Footer /></div>
    </>
  );
}
