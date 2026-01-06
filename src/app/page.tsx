"use client";

import { useEffect } from "react";
// import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/store/productStore";
import { IProduct } from "@/types/product";
import ProductCards from "@/components/ProductCards";

export default function Home() {
    const { products, loading, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#161616] flex items-center justify-center text-white">Loading products...</div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-[24px] sm:text-[40px] font-semibold mb-8">Men’s Jordan Shoes</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product: IProduct) => (
                    // <ProductCard key={product.id} product={product} />
                    <ProductCards key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
