import path from 'path';
import { readJsonFile } from '@/app/dev/research/coc/queen-charge/_party/actions/building-preparation';
import { App } from './_party/app';
import type { LoggerCharging } from './_party/types/logger-charging';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

const FILE_PATH = 'src/app/dev/research/history-charging/_party/Data Charging.json';

export default async function Page(req: PageProps) {
    const loggerCharging = await readJsonFile<LoggerCharging>(path.join(process.cwd(), FILE_PATH));

    return (
        <section className="w-full container">
            <App loggerCharging={loggerCharging} />
        </section>
    );
}
