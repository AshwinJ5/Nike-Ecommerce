"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { purchaseProduct } from "@/lib/api";
import { toast } from "react-hot-toast";
import { ColorMap, IProduct, ISize, IVariationColor } from "@/types/product";

export default function ProductCard({ product }: { product: IProduct }) {
    const imageRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const hoverTween = useRef<gsap.core.Timeline | null>(null);

    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    const { token, isAuthenticated } = useAuthStore();

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!imageRef.current || !circleRef.current || isMobile) return;

        const ctx = gsap.context(() => {
            hoverTween.current = gsap.timeline({ paused: true });

            hoverTween.current
                .to(
                    circleRef.current,
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out",
                    },
                    0
                )
                .to(
                    imageRef.current,
                    {
                        y: -20,
                        scale: 1.05,
                        duration: 0.4,
                        ease: "power2.out",
                    },
                    0
                );
        });

        return () => ctx.revert();
    }, [selectedColorIndex, isMobile]);

    const handleMouseEnter = () => {
        if (!isExpanded && !isMobile) hoverTween.current?.play();
    };

    const handleMouseLeave = () => {
        if (!isExpanded && !isMobile) hoverTween.current?.reverse();
    };

    const handleCardClick = () => {
        if (isMobile) return;
        setIsExpanded((prev) => !prev);
        if (!isExpanded) hoverTween.current?.play();
        else hoverTween.current?.reverse();
    };

    const currentVariation = product.variation_colors?.[selectedColorIndex];
    const availableSizes = currentVariation?.sizes || [];

    const selectedSize = availableSizes[selectedSizeIndex];
    const variationProductId = selectedSize?.variation_product_id;

    const productImage =
        currentVariation?.color_images?.[0] || product.product_images?.[0]?.product_image || "/placeholder.png";

    const backgroundColor = ColorMap[currentVariation?.color_name].code || "#a3e635";

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated || !token) {
            router.push("/login");
            return;
        }

        if (!variationProductId) {
            console.error("No variation selected");
            return;
        }

        try {
            setLoading(true);

            const res = await purchaseProduct({
                variation_product_id: variationProductId.toString(),
                token,
            });

            router.push(`/order-success?orderId=${res.order.id}&status=${res.order.payment_status}`);
        } catch (error) {
            const err = error as Error;
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Mobile view
    if (isMobile) {
        return (
            <div className="relative bg-[#161616] rounded-[3px] overflow-hidden">
                <div className="flex aspect-7/4">
                    <Image
                        src={productImage}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="flex items-center justify-center flex-col gap-4 p-2">
                    <h3 className="text-white font-bold text-[14px] line-clamp-1 uppercase">{product.name}</h3>
                    <div className="flex gap-2">
                        <label className="text-white block text-[12px]">SIZE:</label>
                        <div className="flex gap-1 flex-wrap">
                            {availableSizes.map((size: ISize, index: number) => (
                                <button
                                    key={size.size_id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSizeIndex(index);
                                    }}
                                    disabled={!size.status}
                                    className={`h-[20px] w-[20px] rounded-[3px] text-[10px] font-semibold transition-all ${
                                        selectedSizeIndex === index
                                            ? "bg-white text-neutral-900"
                                            : size.status
                                            ? "bg-neutral-800 text-white"
                                            : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                                    }`}
                                >
                                    {size.size_name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-3 px-2">
                        <label className="text-white block text-[12px]">COLOR:</label>
                        <div className="flex gap-1">
                            {product.variation_colors.map((variation: IVariationColor, index: number) => (
                                <button
                                    key={variation.color_id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedColorIndex(index);
                                        setSelectedSizeIndex(0);
                                    }}
                                    className={`w-4 h-4 rounded-full border transition-all ${
                                        selectedColorIndex === index
                                            ? "border-white scale-110"
                                            : "border-neutral-700"
                                    }`}
                                    style={{
                                        backgroundColor: ColorMap[variation.color_name].code || "#666",
                                    }}
                                    title={variation.color_name}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleBuyNow}
                        disabled={loading}
                        className="bg-white text-black font-semibold px-4 py-2 rounded-[3px] w-full disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Buy Now"}
                    </button>
                </div>
            </div>
        );
    }

    // Desktop view
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
            className="relative bg-[#161616] rounded-lg overflow-hidden cursor-pointer transition-all duration-500"
            style={{ aspectRatio: isExpanded ? "9/16" : "3/4" }}
        >
            {/* Colored circle background */}
            <div
                ref={circleRef}
                className="absolute inset-0 flex items-center justify-center opacity-0"
                style={{ transform: "scale(0.7)" }}
            >
                <div
                    className="rounded-full transition-colors duration-300"
                    style={{
                        width: "140%",
                        height: "140%",
                        backgroundColor,
                    }}
                />
            </div>

            {/* Product Image */}
            <div
                className={`relative z-10 w-full flex items-center justify-center transition-all duration-500 ${
                    isExpanded ? "h-1/2" : "h-full"
                } p-8`}
            >
                <div ref={imageRef} className="relative w-full h-full">
                    <Image
                        src={productImage}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Expanded content */}
            <div
                className={`
                    absolute bottom-0 left-0 right-0 z-20 bg-neutral-900
                    transition-all duration-500
                    ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}
                `}
                style={{ height: "70%" }}
            >
                <div className="p-6 space-y-6">
                    <h3 className="text-white text-2xl font-bold uppercase">{product.name}</h3>

                    {/* SIZE */}
                    <div>
                        <label className="text-white font-bold mb-3 block">SIZE:</label>
                        <div className="flex gap-2 flex-wrap">
                            {availableSizes.map((size: ISize, index: number) => (
                                <button
                                    key={size.size_id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSizeIndex(index);
                                    }}
                                    disabled={!size.status}
                                    className={`px-5 py-3 rounded-lg font-bold transition-all ${
                                        selectedSizeIndex === index
                                            ? "bg-white text-neutral-900"
                                            : size.status
                                            ? "bg-neutral-800 text-white hover:bg-neutral-700"
                                            : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                                    }`}
                                >
                                    {size.size_name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* COLOR */}
                    <div>
                        <label className="text-white font-bold mb-3 block">COLOR:</label>
                        <div className="flex gap-3">
                            {product.variation_colors.map((variation: IVariationColor, index: number) => (
                                <button
                                    key={variation.color_id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedColorIndex(index);
                                        setSelectedSizeIndex(0);
                                    }}
                                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                                        selectedColorIndex === index
                                            ? "border-white scale-110"
                                            : "border-neutral-700 hover:border-neutral-500"
                                    }`}
                                    style={{
                                        backgroundColor: ColorMap[variation.color_name].code || "#666",
                                    }}
                                    title={variation.color_name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Buy Now Button */}
                    <button
                        onClick={handleBuyNow}
                        disabled={loading}
                        className="w-full bg-white text-neutral-900 font-bold text-lg py-4 rounded-lg hover:bg-neutral-200 transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Buy Now"}
                    </button>
                </div>
            </div>

            {/* Product title (when collapsed) */}
            {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-white text-xl font-bold uppercase">{product.name}</h3>
                </div>
            )}
        </div>
    );
}