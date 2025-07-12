import pathPages from '@/generated/app-paths.json';
import { App } from './_party/features/app';

export default async function AppsPage() {
    return (
        <div className="w-full">
            <App paths={pathPages} />
        </div>
    );
}
