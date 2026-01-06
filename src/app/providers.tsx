"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function Providers({ children }: { children: React.ReactNode }) {
    const login = useAuthStore((s) => s.login);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
        };

        const token = getCookie("access_token");
        if (token) {
            login(token);
        }
    }, [login]);

    return (
        <>
            {children}
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#000",
                        color: "#fff",
                        minWidth: "180px",
                    },
                }}
            />
        </>
    );
}
