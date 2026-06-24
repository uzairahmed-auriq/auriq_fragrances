import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductDetailsClient from "../../components/product/ProductDetailsClient";
import ProductReviews from "../../components/product/ProductReviews";
import { productService } from "../../services/productService";

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    const response = await productService.getProductById(id);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found | Auriq" };
  }

  const imageUrl = product.images?.[0]?.image_url || "/icon.svg";

  return {
    title: `${product.name} | Auriq Fragrances`,
    description: product.meta_desc || product.description,
    openGraph: {
      title: `${product.name} | Auriq Fragrances`,
      description: product.meta_desc || product.description,
      images: [{ url: imageUrl, width: 800, height: 1000, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Auriq Fragrances`,
      description: product.meta_desc || product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 w-full bg-perfume-main min-h-screen relative flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-foreground mb-4">Product Not Found</h1>
            <p className="text-foreground/60 mb-8">The fragrance you are looking for does not exist or has been removed.</p>
            <Link href="/collections" className="bg-gold text-background px-8 py-4 font-bold tracking-widest uppercase hover:bg-foreground transition-colors">
              Return to Collections
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-12 pb-6">
          <Link
            href="/collections"
            className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-xs font-bold tracking-[0.2em] uppercase w-max"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>

        <div className="relative z-10 container-lux pb-24">
          <ProductDetailsClient product={product} />
        </div>

        <div className="relative z-10">
          <ProductReviews productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
