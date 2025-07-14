export function AppMeta() {
    return (
        <>
            <link
                rel="icon"
                href="/assets/icons/icon.svg"
                type="image/svg+xml"
            />
            <link
                rel="icon"
                href="/assets/icons/icon-16.png"
                type="image/png"
                sizes="16x16"
            />
            <link
                rel="icon"
                href="/assets/icons/icon-32.png"
                type="image/png"
                sizes="32x32"
            />
            <link
                rel="apple-touch-icon"
                href="/assets/icons/apple-touch-icon.png"
                sizes="180x180"
            />
            <link
                rel="apple-touch-icon"
                href="/assets/icons/apple-touch-icon-120.png"
                sizes="120x120"
            />
            <meta
                name="apple-mobile-web-app-capable"
                content="no"
            />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
            <meta
                name="theme-color"
                media="(prefers-color-scheme: light)"
                content="hsl(0 0% 100%)"
            />
        </>
    );
}
