import { App } from './_party/features/app';

export default function CocQueenPage() {
    return (
        <div
            className="w-full container flex flex-col"
            aria-description="queen charger page"
        >
            <h1 className="mt-8 font-bold text-2xl">COC Queen Charge</h1>
            <App />
        </div>
    );
}
