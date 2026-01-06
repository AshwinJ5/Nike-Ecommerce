export interface IOrder {
    order_id: string;
    created_date: string;
    product_name: string;
    product_price: number;
    product_mrp: number;
    product_image: string;
}

export interface IOrderCardProps {
    order: {
        order_id: string;
        created_date: string;
        product_name: string;
        product_price: number;
        product_mrp: number;
        product_image: string;
        size?: string;
        color_code?: string;
    };
}

export interface IOrderState {
    orders: IOrder[];
    loading: boolean;
    error: string | null;
    fetchOrders: (token: string) => Promise<void>;
}