import { App } from './app';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function Page(req: PageProps) {
    return (
        <div className="w-full bg-red-200">
            <App />
        </div>
    );
}
