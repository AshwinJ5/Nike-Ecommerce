import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchUserOrders } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { IOrder } from "@/types/order";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        redirect("/login");
    }

    let orders = [];
    try {
        const data = await fetchUserOrders(token);
        orders = data.orders || [];
    } catch (error) {
        console.error("Failed to fetch orders", error);
    }

    return (
        <div className="min-h-[700px] bg-[#161616]">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-white text-3xl font-semibold mb-8">My Orders</h1>
                <div className="space-y-6">
                    {orders.map((order: IOrder) => (
                        <OrderCard key={order.order_id} order={order} />
                    ))}
                    {orders.length === 0 && <p className="text-gray-400">No orders found.</p>}
                </div>
            </main>
        </div>
    );
}
