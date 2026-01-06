import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "skilltestnextjs.evidam.zybotechlab.com",
                pathname: "/media/**",
            },
        ],
    },
};

export default nextConfig;
