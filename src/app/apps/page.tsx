import path from 'path';
import { getPathFilePage } from '@/utils/get-path-file-page';
import { App } from './_party/features/app';

export const dynamic = 'force-static';

export default async function AppsPage() {
    const pathPages = (await getPathFilePage(path.join(process.cwd(), 'src', 'app'))).map((path) => ({ url: path }));

    return (
        <div className="w-full">
            <App paths={pathPages} />
        </div>
    );
}
