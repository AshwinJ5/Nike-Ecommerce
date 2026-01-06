export interface IProduct {
   id: string;
    name: string;
    slug: string;
    mrp: number;
    sale_price: number;
    discount: number;
    new: boolean;
    out_of_stock: boolean;
    variations_exist: boolean;
    variation_colors: IVariationColor[];
    product_images: Array<{ product_image?: string }>;
}

export interface IProductState {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export interface ISize {
    size_id: number;
    size_name: string;
    price: number;
    status: boolean;
    variation_product_id: number;
}

export interface IVariationColor {
    color_id: number;
    color_name: string;
    color_images: string[];
    sizes:  ISize[];
    status: boolean;
}

export const ColorMap: Record<string, string> = {
    Green: "#840D91",
    Purple: "#840D91",
    Red: "#9D333B",
    White: "#f3f4f6",
    Black: "#1f2937",
    Blue: "#2563eb",
    Yellow: "#facc15",
    Pink: "#ec4899",
    Orange: "#f97316",
    Lime: "#a3e635",
};