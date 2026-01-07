import { useRef, useEffect, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ColorMap, IProduct, ISize } from "@/types/product";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { purchaseProduct } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ProductCards({ product }: { product: IProduct }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { token, isAuthenticated } = useAuthStore();

    const selectedColor = product.variation_colors?.[selectedColorIndex];
    const colorName = selectedColor?.color_name || "Green";

    // Derived values
    const availableSizes = selectedColor?.sizes || [];
    const selectedSize = availableSizes[selectedSizeIndex];
    const variationProductId = selectedSize?.variation_product_id;

    // Derived values from ColorMap
    const colorData = ColorMap[colorName] || { code: "#9ADA2A", image: "/shoe_green.png" };
    const backgroundColor = colorData.code;
    const productImage = colorData.image;

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated || !token) {
            router.push("/login");
            return;
        }

        if (!variationProductId) {
            toast.error("Please select a size/variation");
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

    useLayoutEffect(() => {
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!canHover) return;

        const ctx = gsap.context(() => {
            const container = containerRef.current;
            if (!container) return;

            const hoverIn = () => {
                gsap.to(circleRef.current, {
                    bottom: 245,
                    left: 50,
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(textRef.current, {
                    bottom: 75,
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(imageRef.current, {
                    bottom: 300,
                    duration: 0.6,
                    ease: "power3.out",
                });

                tlRef.current?.kill();

                tlRef.current = gsap
                    .timeline()
                    .to(titleRef.current, {
                        bottom: 170,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power3.out",
                    })
                    .to(sizeRef.current, {
                        bottom: 120,
                        opacity: 1,
                        duration: 0.3,
                        ease: "power3.out",
                    })
                    .to(colorRef.current, {
                        bottom: 80,
                        opacity: 1,
                        duration: 0.3,
                        ease: "power3.out",
                    })
                    .to(buttonRef.current, {
                        bottom: 10,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                    });
            };

            const hoverOut = () => {
                tlRef.current?.kill();
                tlRef.current = null;

                gsap.to(circleRef.current, {
                    bottom: "175px",
                    left: "-20px",
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(textRef.current, {
                    bottom: "0px",
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(imageRef.current, {
                    bottom: 145,
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(titleRef.current, {
                    bottom: 50,
                    duration: 0.5,
                    ease: "power3.out",
                });

                gsap.to([sizeRef.current, colorRef.current, buttonRef.current], {
                    bottom: -30,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out",
                });
            };

            container.addEventListener("mouseenter", hoverIn);
            container.addEventListener("mouseleave", hoverOut);

            return () => {
                container.removeEventListener("mouseenter", hoverIn);
                container.removeEventListener("mouseleave", hoverOut);
            };
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="aspect-3/4 bg-[#232323] overflow-hidden relative flex items-center justify-center group"
        >
            <div
                ref={circleRef}
                className="h-[384px] w-[384px] rounded-full absolute z-20 transition-colors duration-500"
                style={{ bottom: "175px", left: "-20px", backgroundColor }}
            />

            <span
                ref={textRef}
                className="text-[#ffffff08] sm:text-[160px] text-[86px] font-bold tracking-[-0.03em] italic z-10 relative"
                style={{ bottom: "0px" }}
            >
                NIKE
            </span>
            <div
                ref={imageRef}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                style={{ bottom: 145, rotate: "-27deg" }}
            >
                <Image src={productImage} alt="Nike Shoe" width={300} height={400} />
            </div>
            <div
                ref={titleRef}
                className="absolute left-0 right-0 text-center text-white uppercase font-bold text-[20px]"
                style={{ bottom: 50 }}
            >
                {product.name}
            </div>

            <div
                ref={sizeRef}
                className="absolute left-0 right-0 text-center text-white z-50 flex justify-center gap-4 items-center"
                style={{ bottom: -30, opacity: 0 }}
            >
                <label className="block text-[16px]">SIZE:</label>
                <div className="flex gap-1 justify-center flex-wrap">
                    {availableSizes
                        .sort((a, b) => Number(a.size_name) - Number(b.size_name))
                        .map((size: ISize, index: number) => (
                            <button
                                key={size.variation_product_id}
                                disabled={!size.status}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSizeIndex(index);
                                }}
                                className={`h-[30px] w-[30px] rounded-[5px] text-[16px] font-semibold transition-all
                ${
                    selectedSizeIndex === index
                        ? "bg-white text-neutral-900 scale-110"
                        : size.status
                        ? "bg-[#372224] text-white hover:bg-neutral-700 cursor-pointer"
                        : "bg-[#372224]/50 text-white/50 cursor-not-allowed"
                }`}
                            >
                                {size.size_name}
                            </button>
                        ))}
                </div>
            </div>
            <div
                ref={colorRef}
                className="absolute left-0 right-0 flex justify-center items-center gap-3 text-white opacity-0"
                style={{ bottom: -30, opacity: 0 }}
            >
                <span className="text-[14px]">COLOR:</span>
                <div className="flex gap-2">
                    {product.variation_colors.map((variation, index) => (
                        <button
                            key={variation.color_id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColorIndex(index);
                                setSelectedSizeIndex(0);
                            }}
                            className={`w-[15px] h-[15px] rounded-full border-2 transition-all ${
                                selectedColorIndex === index ? "border-white scale-110" : "border-neutral-600"
                            }`}
                            style={{
                                backgroundColor: ColorMap[variation.color_name]?.code || "#666",
                            }}
                        />
                    ))}
                </div>
            </div>
            {/* BUY BUTTON */}
            <button
                ref={buttonRef}
                onClick={handleBuyNow}
                disabled={loading}
                className="absolute left-1/2 -translate-x-1/2 text-black bg-white p-3 rounded-[5px] uppercase font-bold text-[16px] gap-5 disabled:opacity-50 w-[90%] sm:w-[50%]"
                style={{ bottom: -30, opacity: 0 }}
            >
                {loading ? (
                    <span className="h-5 w-5 block mx-auto border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                    "BUY NOW"
                )}
            </button>
        </div>
    );
}
