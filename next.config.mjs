import { createContentlayerPlugin } from 'next-contentlayer';
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['lucide-react'],
    // serverExternalPackages: ['fs', '@kwsites/file-exists'],
    // serverComponentsExternalPackage: ['fs', '@kwsites/file-exists'],
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        // Important: return the modified config
        // config.resolve.fallback = { ...config.resolve.fallback /*  fs: false, */ };
        return config;
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    },
};
const withContentlayer = createContentlayerPlugin({
    // Additional Contentlayer config options
});

export default withContentlayer({ ...nextConfig });
