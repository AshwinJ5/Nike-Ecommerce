import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="sm:bg-[#000000] bg-[#1B1B1B]  bottom-0 w-full">
            <div className="max-w-7xl mx-auto sm:h-[244px] h-[120px] flex justify-between items-center text-white px-4">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.svg" alt="Nike" width={68} height={36} className="" />
                </Link>

                <div className="flex sm:gap-[44px]  gap-[20px] text-xl">
                    <Link href="#" className="cursor-pointer hover:text-gray-300"><Image src="/facebook.svg" alt="Facebook" width={21} height={22} className="" /></Link>
                    <Link href="#" className="cursor-pointer hover:text-gray-300"><Image src="/instagram.svg" alt="Instagram" width={21} height={22} className="" /></Link>
                    <Link href="#" className="cursor-pointer hover:text-gray-300"><Image src="/x.svg" alt="X" width={21} height={22} className="" /></Link>
                </div>
            </div>
        </footer>
    );
}
