import { create } from "zustand";
import { fetchUserOrders } from "@/lib/api";
import { IOrderState } from "@/types/order";

export const useOrderStore = create<IOrderState>((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async (token: string) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchUserOrders(token);
            set({ orders: data.orders || [], loading: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch orders", loading: false });
        }
    },
}));
