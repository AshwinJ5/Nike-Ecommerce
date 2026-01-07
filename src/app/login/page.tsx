"use client";

import Image from "next/image";
import { useState } from "react";
import { verifyUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [step, setStep] = useState<"phone" | "register">("phone");
    const [loading, setLoading] = useState(false);

    const login = useAuthStore((s) => s.login);
    const router = useRouter();

    // STEP 1: Verify phone (OTP is static as per test)
    const handleVerify = async () => {
        if (!phone) return;

        try {
            setLoading(true);

            const res = await verifyUser(phone);

            if (res.user) {
                // Existing user → auto login
                // Set cookie for middleware/SSR
                document.cookie = `access_token=${res.token.access}; path=/; max-age=604800; SameSite=Lax`;

                login(res.token.access);
                router.push("/");
            } else {
                // New user → show name field
                setStep("register");
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Register new user
    const handleRegister = async () => {
        if (!name) return;

        try {
            setLoading(true);
            const res = await registerUser({
                name,
                phone_number: phone,
            });

            // Set cookie for middleware/SSR
            document.cookie = `access_token=${res.token.access}; path=/; max-age=604800; SameSite=Lax`;

            login(res.token.access, {
                name: res.name,
                phone: res.phone_number,
            });

            router.push("/");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex">
            <div className="hidden md:block md:w-[50%] relative">
                <Image src="/login.jpg" alt="Login" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-[#00000033] z-10" />
            </div>

            <div className="w-full md:w-[50%] flex sm:items-center items-start px-[16px] py-[40px]">
                <div className="w-full max-w-[620px] px-4 mx-auto">
                    <h1 className="text-white sm:text-[28px] text-[24px] font-semibold mb-10 text-center">Log In</h1>

                    {step === "phone" && (
                        <>
                            <div className="mb-8">
                                <label className="block text-sm text-gray-400 mb-2">Phone</label>

                                <input
                                    type="tel"
                                    placeholder="Enter Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-[52px] px-4 bg-[#1a1a1a] text-white rounded-xl outline-none placeholder:text-gray-500"
                                />
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className="w-full h-[54px] bg-white text-black rounded-xl font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? "Please wait..." : "Continue"}
                            </button>
                        </>
                    )}

                    {step === "register" && (
                        <>
                            <div className="mb-8">
                                <label className="block text-sm text-gray-400 mb-2">Name</label>

                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-[52px] px-4 bg-[#1a1a1a] text-white rounded-xl outline-none placeholder:text-gray-500"
                                />
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full h-[54px] bg-white text-black rounded-xl font-medium text-[16px] hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? "Creating account..." : "Continue"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
