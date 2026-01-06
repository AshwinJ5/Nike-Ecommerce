import { create } from "zustand";
import { fetchNewProducts } from "@/lib/api";
import { IProductState } from "@/types/product";

export const useProductStore = create<IProductState>((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchNewProducts();
            const products = data?.products || data || [];
            set({ products, loading: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch products", loading: false });
        }
    },
}));
