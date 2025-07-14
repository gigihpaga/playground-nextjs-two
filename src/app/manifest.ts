import type { MetadataRoute, Metadata } from 'next';

/**
 * [accesed](/http://localhost:3000/manifest.webmanifest)
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Paga Space',
        short_name: 'Paga Space',
        description: 'Paga Playground for Javascript',
        start_url: '/',
        display: 'standalone',
        background_color: 'hsl(0 0% 100%)',
        theme_color: 'hsl(0 0% 100%)', // this reference to global.css --background: 0 0% 100%;
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/assets/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/assets/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/assets/icons/icon-512-mask.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
