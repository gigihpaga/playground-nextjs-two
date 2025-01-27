import { App } from './_party/features/app';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function LeardReactQueryPage(req: PageProps) {
    return (
        <section
            className="w-full container"
            aria-details="Leard React Query Page"
        >
            <App />
        </section>
    );
}
