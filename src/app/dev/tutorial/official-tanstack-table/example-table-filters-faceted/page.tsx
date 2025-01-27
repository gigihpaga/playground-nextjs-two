import { App } from './_party/app';
import './_party/styles.css';
interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function Page(req: PageProps) {
    return (
        <div className="w-full container">
            <h1>example-table-filters-faceted</h1>
            <App />
        </div>
    );
}
