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

export const ColorMap: Record<string, {code:string, image:string}> = {
    White: {code:"#9ADA2A", image:"/shoe_green.png"},
    Red: {code:"#840D91", image:"/shoe_purple.png"},
    Black: {code:"#9D333B", image:"/shoe_red.png"},
    Blue: {code:"#2563eb", image:"/shoe_green.png"},
    Yellow: {code:"#facc15", image:"/shoe_purple.png"},
    Pink: {code:"#ec4899", image:"/shoe_red.png"},
    Orange: {code:"#f97316", image:"/shoe_red.png"},
    Lime: {code:"#a3e635", image:"/shoe_green.png"},
};