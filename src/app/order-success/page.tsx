import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchUserOrders } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { formatWithOrdinal } from "@/shortcuts/formatWithOrdinal";
import { IOrder } from "@/types/order";

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const resolvedSearchParams = await searchParams;
    const orderId = resolvedSearchParams.orderId as string;

    let order: IOrder | null = null;
    try {
        const data = await fetchUserOrders(token);
        order = data.orders.find((o: IOrder) => o.order_id === orderId) || data.orders[0];
    } catch (error) {
        console.error("Failed to load order", error);
    }

    if (!order) {
        return <div className="min-h-screen bg-[#161616] flex items-center justify-center text-white">Order not found</div>;
    }

    return (
        <div className="min-h-[700px] bg-[#161616] flex flex-col items-center sm:justify-center justify-start sm:py-0 py-10 px-4">
            <div className="mb-6">
                <Image src="/logo.svg" alt="Nike" width={60} height={60} />
            </div>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2 text-center">Successfully Ordered!</h1>

            <p className="text-gray-400 text-sm mb-10">{formatWithOrdinal(order.created_date)}</p>

            <div className="w-full max-w-xl">
                <OrderCard order={order} />
            </div>
        </div>
    );
}
