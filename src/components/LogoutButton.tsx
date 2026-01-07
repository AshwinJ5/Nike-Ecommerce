"use client";

import { useAuthStore } from "@/store/authStore";

export default function LogoutButton() {
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        document.cookie = "access_token=; path=/; max-age=0";
        logout();
        window.location.href = "/";
    };

    return (
        <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 text-white font-semibold text-sm rounded-lg transition hover:opacity-80"
        >
            Log Out
        </button>
    );
}
