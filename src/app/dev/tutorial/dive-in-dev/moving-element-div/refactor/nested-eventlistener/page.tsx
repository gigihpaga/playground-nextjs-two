import { App } from './_party/features/app';

export default async function RefactorNestedEventListenerPage() {
    return (
        <section className="w-full bg-orange-700 container">
            <h1 className="font-bold text-2xl mb-5">Moving element Div Page (Refactor/Nested Event Listener)</h1>
            <App />
        </section>
    );
}
