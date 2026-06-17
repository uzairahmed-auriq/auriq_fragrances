import { Metadata } from "next";
import { Suspense } from "react";
import { productService } from "../services/productService";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "The Collection | Auriq Fragrances",
  description: "Explore our complete portfolio of luxury fragrances. Each scent is a masterpiece, crafted with the finest ingredients to evoke profound emotions.",
};

export default async function CollectionsPage() {
  // Fetch data on the server so it loads instantly for the user
  let products = [];
  try {
    const response = await productService.getAllProducts();
    if (response.success) {
      products = response.data;
    }
  } catch (err) {
    console.warn("Failed to fetch collections on server", err instanceof Error ? err.message : String(err));
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-perfume-main flex items-center justify-center text-gold">Loading Collection...</div>}>
      <CollectionsClient initialProducts={products} />
    </Suspense>
  );
}
