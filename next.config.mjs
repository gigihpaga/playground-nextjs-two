import { createContentlayerPlugin } from 'next-contentlayer';
import createPWAPlugin from '@ducanh2912/next-pwa';
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
        // removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    },
    async headers() {
        return [
            {
                source: '/images/coc-building/:path*', // Cache untuk folder coc-building
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=604800, must-revalidate', // cache 1 minggu (public, max-age=60, must-revalidate adalah default nextjs, selain dari "must-revalidate" ada "immutable" (immutable artinya cache yang lebih extream))
                    },
                ],
            },
            {
                source: '/images/coc-lab/:path*', // Cache untuk folder coc-lab
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=604800, must-revalidate',
                    },
                ],
            },
        ];
    },
};
const withContentlayer = createContentlayerPlugin({
    // Additional Contentlayer config options
});

const withPWA = createPWAPlugin({
    dest: 'public',
    cacheOnFrontEndNav: false,
    aggressiveFrontEndNavCaching: false,
    reloadOnOnline: true,
    disable: false, // process.env.NODE_ENV === 'development'
    workboxOptions: {
        disableDevLogs: false,
    },
    register: true,
    // skipWaiting: true,
});

const nextWithPlugins = withContentlayer(withPWA({ ...nextConfig }));

export default nextWithPlugins;
