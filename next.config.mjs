
import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    experimental: {
        appDir: true,
    },
};

export default withPWA({
    ...nextConfig,
    pwa: {
        dest: "public",
        cacheOnFrontEndNav: true,
        aggressiveFrontEndNavCaching: true,
        reloadOnOnline: true,
        disable: false,
        workboxOptions: {
            disableDevLogs: true,
        },
    },
});
