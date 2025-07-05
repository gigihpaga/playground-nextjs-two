import { App } from './_party/app';

export default async function OwnZoomPanPinch() {
    return (
        <div
            className="flex flex-col container p-2 sm:px-6 md:px-8 overflow-hidden h-[calc(100vh-100px)]  md:h-[calc(100vh-65px)]"
            aria-description="fireball simulation page"
        >
            <App />
        </div>
    );
}
