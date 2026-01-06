import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

export default function NavbarAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <div className="flex items-center gap-[16px]">
            <Link href={isAuthenticated ? "/profile" : "/login"}>
                <Image src="/user.svg" alt="Profile" width={24} height={24} className="hover:opacity-80 transition" />
            </Link>

            {!isAuthenticated ? (
                <Link
                    href="/login"
                    className="py-2 text-white font-semibold text-sm rounded-lg transition hover:opacity-80"
                >
                    Log In
                </Link>
            ) : (
                <LogoutButton />
            )}
        </div>
    );
}
