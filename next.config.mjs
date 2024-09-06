/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // disable the default behavior of Next.js to optimize images
    images: {
        unoptimized: true,
    }
};

export default nextConfig;
