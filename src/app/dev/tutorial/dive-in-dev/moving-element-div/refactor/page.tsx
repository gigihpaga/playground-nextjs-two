import { App } from './_party/features/app';

export default async function RefactorPage() {
    return (
        <section className="w-full bg-green-700 container">
            <h1 className="font-bold text-2xl mb-5">Moving element Div Page (Refactor)</h1>
            <App />
        </section>
    );
}
