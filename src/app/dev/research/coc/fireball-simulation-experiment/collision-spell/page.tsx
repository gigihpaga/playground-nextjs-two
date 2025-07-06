// import { App } from './_party/app';
// import { App } from './_party/app-v2';
// import { App } from './_party/app-v3';
// import { App } from './_party/app-v4';
// import { App } from './_party/app-v5';
// import { App } from './_party/app-v6';
// import { App } from './_party/app-v6b';
// import { App } from './_party/app-v6-edit-by-me';
import { App } from './_party/app-v7'; // final!! untuk simulasi spell invisible

export default function CollisionObjectPage() {
    return (
        <div
            className="w-full container flex flex-col relative"
            aria-description="queen charger page"
        >
            <h1 className="mt-8 font-bold text-2xl">Collision Spell</h1>
            <App />
        </div>
    );
}
