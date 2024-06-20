import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config = {
    darkMode: ['class'],
    // darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/lib/*.{js,ts,jsx,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                enterFromRight: {
                    from: { opacity: '0', transform: 'translateX(200px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                enterFromLeft: {
                    from: { opacity: '0', transform: 'translateX(-200px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                exitToRight: {
                    from: { opacity: '1', transform: 'translateX(0)' },
                    to: { opacity: '0', transform: 'translateX(200px)' },
                },
                exitToLeft: {
                    from: { opacity: '1', transform: 'translateX(0)' },
                    to: { opacity: '0', transform: 'translateX(-200px)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'rotateX(-10deg) scale(0.9)' },
                    to: { opacity: '1', transform: 'rotateX(0deg) scale(1)' },
                },
                scaleOut: {
                    from: { opacity: '1', transform: 'rotateX(0deg) scale(1)' },
                    to: { opacity: '0', transform: 'rotateX(-10deg) scale(0.95)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                fadeOut: {
                    from: { opacity: '1' },
                    to: { opacity: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                scaleIn: 'scaleIn 200ms ease',
                scaleOut: 'scaleOut 200ms ease',
                fadeIn: 'fadeIn 200ms ease',
                fadeOut: 'fadeOut 200ms ease',
                enterFromLeft: 'enterFromLeft 250ms ease',
                enterFromRight: 'enterFromRight 250ms ease',
                exitToLeft: 'exitToLeft 250ms ease',
                exitToRight: 'exitToRight 250ms ease',
            },
            // custom user configuration
            bgGradientDeg: {
                75: '75deg',
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        /**
         * resource:
         * [Is there a way to adjust the angle of the linear gradient in Tailwind CSS?](https://stackoverflow.com/questions/71120394/is-there-a-way-to-adjust-the-angle-of-the-linear-gradient-in-tailwind-css)
         */
        plugin(function ({ matchUtilities, theme, addComponents, e, config, addUtilities }) {
            matchUtilities(
                {
                    'bg-gradient-deg': (angle) => ({
                        'background-image': `linear-gradient(${angle}, var(--tw-gradient-stops))`,
                    }),
                },
                {
                    // values from config and defaults you wish to use most
                    values: Object.assign(
                        theme('bgGradientDeg', {}), // name of config key. Must be unique
                        {
                            10: '10deg', // bg-gradient-deg-10
                            15: '15deg',
                            20: '20deg',
                            25: '25deg',
                            30: '30deg',
                            45: '45deg',
                            60: '60deg',
                            90: '90deg',
                            120: '120deg',
                            135: '135deg',
                        }
                    ),
                }
            );
        }),
    ],
} satisfies Config;

export default config;
