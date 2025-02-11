'use server';
import Bottleneck from 'bottleneck';
import { grabPackageName, readFileTextContent } from '../utils/get-package-from-file';

export type PakageInFile = { path: string; pakages: string[] };

export async function getPagakage(paths: string[]) {
    try {
        return paths.reduce(
            async (acc, curr, idx) => {
                let _acc = await acc;

                const textContent = await readFileTextContent(curr);
                const packages = grabPackageName(textContent);

                _acc.push({ path: curr, pakages: packages });

                return _acc;
            },
            [] as never as Promise<PakageInFile[]>
        );
    } catch (error) {
        console.log('error getPagakage', error);
        return [];
    }
}

export async function _getPakageByCommitTopic<T extends Record<string, unknown> & { files: Array<{ path: string }> }>(topicsCommit: T[]) {
    const v = topicsCommit.reduce(
        async (acc, curr) => {
            let _acc = await acc;
            const dependencysInFile = await getPagakage(curr.files.map((file) => file.path));
            _acc.push({ ...curr, dependencysInFile: dependencysInFile });
            return acc;
        },
        [] as never as Promise<Array<T & { dependencysInFile: PakageInFile[] }>>
    );

    return v;
}

export async function getPakageInFileByTopic<T extends Record<string, unknown> & { files: Array<{ path: string }> }>(topicsCommit: T[]) {
    try {
        const limiter = new Bottleneck({ maxConcurrent: 5 }); // Limit concurrent topic processing

        const promises = topicsCommit.map((topic) =>
            limiter.schedule(async () => {
                const dependencysInFile = await getPagakage(topic.files.map((file) => file.path));
                return { ...topic, dependencysInFile };
            })
        );

        return Promise.all(promises);
    } catch (error) {
        console.log('error getPakageInFile', error);
        return [];
    }
}

export async function getPakageInFilePath<T extends Record<string, unknown> & { path: string }>(paramsWithPath: T[]) {
    try {
        const limiter = new Bottleneck({ maxConcurrent: 5 }); // Limit concurrent topic processing

        const promises = paramsWithPath.map((pwp) => {
            return limiter.schedule(async () => {
                const dependencysInFile = (await getPagakage([pwp.path])).flatMap((pif) => pif.pakages);
                const dependencysInFileSet = new Set(dependencysInFile);
                const dependencysInFileFacets = Array.from(dependencysInFileSet);

                return { ...pwp, dependencysInFile: dependencysInFileFacets };
            });
        });

        return Promise.all(promises);
    } catch (error) {
        console.log('error getPakageInFile', error);
        return [];
    }
}
