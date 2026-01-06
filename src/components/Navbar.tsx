import Image from "next/image";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import { cookies } from "next/headers";

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    const isAuthenticated = !!token;

    return (
        <header className="bg-[#191919]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl ">
                    <Image src={"/logo.svg"} height={28} width={54} alt="logo" />
                </Link>
                <NavbarAuth isAuthenticated={isAuthenticated} />
            </div>
        </header>
    );
}
