import { App } from './_party/app';

export default async function Page() {
    return (
        <div className="w-full container py-2">
            <h1 className="text-lg">IndexedDB using idb-keyval</h1>
            <App />
        </div>
    );
}
