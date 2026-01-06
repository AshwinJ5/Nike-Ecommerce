"use client";

import { formatWithOrdinal } from "@/shortcuts/formatWithOrdinal";
import { IOrderCardProps } from "@/types/order";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function OrderCard({ order }: IOrderCardProps) {
    const pathname = usePathname();

    return (
        <div className="bg-[#FFFFFF14] rounded-2xl p-4 flex items-start gap-4 max-w-[806px]">
            <div className="w-[85px] h-[75px] bg-[#9BE22D] rounded-xl overflow-hidden shrink-0">
                <Image
                    src={order.product_image || "/product-success.png"}
                    alt="Product"
                    width={85}
                    height={75}
                    className="w-full h-full object-cover object-top"
                />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="flex flex-col gap-1 sm:gap-2">
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1">{order.product_name}</h3>

                    <div className="flex sm:hidden items-center gap-2">
                        <p className="text-white font-semibold text-sm">₹{order.product_price}</p>
                        <p className="text-gray-400 text-xs line-through">₹{order.product_mrp}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <span>Size: {order.size || "UK 6"}</span>
                        <span>9ADA2A</span>
                    </div>

                    {pathname !== "/order-success" && (
                        <p className="hidden sm:block text-gray-400 text-xs mt-1">
                            {formatWithOrdinal(order.created_date)}
                        </p>
                    )}
                </div>

                <div className="hidden sm:flex gap-2 items-end">
                    <p className="text-white font-semibold text-base">₹{order.product_price}</p>
                    <p className="text-gray-400 text-sm line-through">₹{order.product_mrp}</p>
                </div>
            </div>
        </div>
    );
}
