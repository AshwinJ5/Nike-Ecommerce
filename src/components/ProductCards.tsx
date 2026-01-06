import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ColorMap, IProduct, ISize } from "@/types/product";

export default function ProductCards({ product }: { product: IProduct }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const selectedColor = product.variation_colors?.[selectedColorIndex];
    const colorName = selectedColor?.color_name || "Green";

    // Derived values from ColorMap
    const colorData = ColorMap[colorName] || { code: "#9ADA2A", image: "/shoe_green.png" };
    const backgroundColor = colorData.code;
    const productImage = colorData.image;

    useEffect(() => {
        const container = containerRef.current;
        const circle = circleRef.current;
        const text = textRef.current;
        const title = titleRef.current;
        const image = imageRef.current;
        const size = sizeRef.current;
        const color = colorRef.current;
        const button = buttonRef.current;

        if (!container || !circle) return;

        const hoverIn = () => {
            gsap.to(circle, {
                bottom: 245,
                left: 50,
                duration: 0.6,
                ease: "power3.out",
            });

            gsap.to(text, {
                bottom: 75,
                duration: 0.6,
                ease: "power3.out",
            });

            gsap.to(image, {
                bottom: 300,
                duration: 0.6,
                ease: "power3.out",
            });

            // 👇 Sequential reveal
            const tl = gsap.timeline();

            tl.to(title, {
                bottom: 170,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
            })
                .to(size, {
                    bottom: 120,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power3.out",
                })
                .to(color, {
                    bottom: 80,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power3.out",
                })
                .to(button, {
                    bottom: 10,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                });
        };

        const hoverOut = () => {
            gsap.to(circle, {
                bottom: "175px",
                left: "-20px",
                duration: 0.6,
                ease: "power3.out",
            });
            gsap.to(text, {
                bottom: "0px",
                duration: 0.6,
                ease: "power3.out",
            });
            gsap.to(image, {
                bottom: 145,
                // rotation: -37,
                duration: 0.6,
                ease: "power3.out",
            });

            gsap.to(title, {
                bottom: 50,
                duration: 0.5,
                ease: "power3.out",
            });

            gsap.to([size, color], {
                bottom: -30,
                opacity: 0,
                duration: 0.5,
                ease: "power3.out",
            });
            gsap.to(button, {
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
                className="text-[#ffffff08] text-[160px] font-bold tracking-[-0.03em] italic z-10 relative"
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
                style={{ bottom: -30 }}
            >
                <label className="block text-[16px]">SIZE:</label>
                <div className="flex gap-1 justify-center flex-wrap">
                    {selectedColor?.sizes
                        ?.sort((a, b) => Number(a.size_name) - Number(b.size_name))
                        ?.map((size: ISize) => (
                            <button
                                key={size.variation_product_id}
                                disabled={!size.status}
                                className={`h-[30px] w-[30px] rounded-[5px] text-[16px] font-semibold text-black
                ${
                    size.status ? " bg-white text-neutral-800 cursor-pointer" : "bg-[#372224] text-white cursor-not-allowed"
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
                style={{ bottom: -30 }}
            >
                <span className="text-[14px]">COLOR:</span>
                <div className="flex gap-2">
                    {product.variation_colors.map((variation, index) => (
                        <button
                            key={variation.color_id}
                            onClick={() => setSelectedColorIndex(index)}
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
                className="absolute left-1/2 -translate-x-1/2 text-black bg-white p-3 rounded-[5px] uppercase font-bold text-[16px] gap-5"
                style={{ bottom: -30, opacity: 0 }}
            >
                BUY NOW
            </button>
        </div>
    );
}
