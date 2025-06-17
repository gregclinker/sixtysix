/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
        CONSTITUENCY: process.env.NEXT_PUBLIC_CONSTITUENCY,
        MAP_KEY: process.env.NEXT_PUBLIC_MAP_KEY,
    }
};

export default nextConfig;
