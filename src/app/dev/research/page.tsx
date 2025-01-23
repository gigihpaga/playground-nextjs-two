import { getPathFilePage } from '@/utils/get-path-file-page';
import { getDirName } from '@/utils/get-dirname';
import { EachList } from '@/components/ui/custom/each-list';

export default async function ResearchPage() {
    const __dirname = getDirName(import.meta.url);
    const pathPages = await getPathFilePage(__dirname);

    return (
        <div>
            <ul className="">
                <EachList
                    items={pathPages}
                    render={(path) => (
                        <li key={path}>
                            <a
                                className="underline-offset-4 font-light"
                                href={path}
                            >
                                <EachList
                                    items={path.split('/')}
                                    render={(word) =>
                                        word === '' ? null : (
                                            <>
                                                <span className="text-blue-400">/</span>
                                                {word}
                                            </>
                                        )
                                    }
                                />
                            </a>
                        </li>
                    )}
                />
            </ul>
        </div>
    );
}
