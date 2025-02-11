import path from 'node:path';
import { cwd } from 'node:process';
import os from 'node:os';
import fsp from 'node:fs/promises';
import fs from 'node:fs';

import git from 'simple-git';

type StatusUntracked = 'untracked';

type StatusModified = 'modified';

export type UntrackedAndModifiedFile = {
    path: string;
    status: StatusUntracked | StatusModified;
};

export type HistoryCommit = { hash: string; subject: string; body: string; date: string };

export async function getUntrackedFiles() {
    const listFiles = await git().raw('ls-files', '--others', '--exclude-standard');
    return listFiles.split('\n').filter((d) => d !== '');
}

export async function getModifiedFiles() {
    const listFiles = await git().raw('ls-files', '--modified', '--exclude-standard');
    return listFiles.split('\n').filter((d) => d !== '');
}

export async function getUntrackedAndModifiedFiles() {
    const u = await getUntrackedFiles();
    const m = await getModifiedFiles();

    const files = u
        .map((d) => ({ path: d, status: 'untracked' }))
        .concat(m.map((d) => ({ path: d, status: 'modified' }))) as Array<UntrackedAndModifiedFile>;

    const filesSorted = files.sort(({ path: pathA }, { path: pathB }) => pathA.localeCompare(pathB, undefined, { sensitivity: 'base' }));
    return filesSorted;
}

/**
 *
 * @param path
 * @returns
 *
 * @info
 * this function cannot running in client component, because `simple-git` using module `fs` under the hood
 *
 * @example
 * await getHistoryCommitOfFile(path.join(process.cwd(), "package.json"))
 */
export async function getHistoryCommitOfFile(path: string) {
    try {
        if (!fs.existsSync(path)) throw new Error(`you search ${path}, but this path not exist`);

        const listFiles = await git().raw(
            'log',
            '--pretty=format:{(dquote)hash(dquote): (dquote)%H(dquote),(dquote)subject(dquote): (dquote)%s(dquote),(dquote)body(dquote): (dquote)%b(dquote),(dquote)date(dquote): %cd}(endseparator)',
            '--date=format:(dquote)%d %B %Y %H:%M:%S(dquote)',
            '--follow',
            '--all',
            path
        );

        const arr = listFiles
            .replaceAll('"', '\\"') // replace <"> to <\\\">
            .replaceAll('(dquote)', '"') // replace <(dquote)> to <">
            .replaceAll('\n', '\\n') // replace <\n> to <\\n>
            .split('(endseparator)\\n');

        const final =
            arr.length === 1 && arr[0].length === 0 // meaning: ['']
                ? []
                : arr.map((curr, idx) => {
                      const stringClean = curr.replace('(endseparator)', ''); // ensure clean <(endseparator)>
                      const obj = JSON.parse(stringClean) as HistoryCommit;
                      return obj;
                  });

        return final;
    } catch (error) {
        return [];
    }
}

/**
 *
 * @param path
 * @returns
 *
 * @info
 * this function cannot running in client component, because `simple-git` using module `fs` under the hood. this function optimize by gemini
 *
 * @example
 * await getHistoryCommitOfFile(path.join(process.cwd(), "package.json"))
 */
export async function getHistoryCommitOfFile2(path: string): Promise<HistoryCommit[]> {
    try {
        if (!fs.existsSync(path)) {
            throw new Error(`Path not found: ${path}`); // More informative error message
        }

        const listHistoryCommit = await git().log({
            format: {
                hash: '%H',
                subject: '%s',
                body: '%b',
                date: '%cd', // Keep date formatting within simple-git
            },
            file: path,
            '--follow': null, // [Use null for boolean flags in simple-git options](https://github.com/steveukx/git-js?tab=readme-ov-file#options-as-an-object)
            '--all': null,
            '--date': 'format:%d %B %Y %H:%M:%S', // Format date directly
        });

        const result = listHistoryCommit.all.map((commit) => ({
            hash: commit.hash,
            subject: commit.subject,
            body: commit.body,
            date: commit.date, // Directly use the formatted date
        }));

        console.log('getHistoryCommitOfFile2', result);
        return result;
    } catch (error) {
        console.error('Error retrieving commit history:', error); // Log the error for debugging
        return [];
    }
}

/**
 *
 * @param hash
 * @returns
 *
 * @info
 * this function cannot running in client component, because `simple-git` using module `fs` under the hood
 *
 * @example
 * // use
 * await getFilesFromCommit("82fc3ff8e3aab9a431a09d34ef513995a72211af");
 * // or
 * await getFilesFromCommit("82fc3");
 *
 * // return
 * ['package.json', 'src/app/auth/_party/components/back-button.tsx']
 */
export async function getFilesFromCommit(hash: string) {
    if (typeof hash !== 'string') {
        throw new Error(`in function getFilesFromCommit, hash parameter must be string. but you passing, type hash is "${typeof hash}"`);
    }
    if (typeof hash === 'string' && hash.length < 5) {
        throw new Error('in function getFilesFromCommit, hash parameter must be 5 characters or more');
    }

    //git diff-tree --no-commit-id --name-only -r
    const listFiles = await git().raw(
        // 'git',
        'diff-tree',
        '--no-commit-id',
        '--name-only',
        '-r',
        hash
    );

    const final = listFiles.split('\n');

    return final;
}

export async function getDiffFile() {
    const result = await git().raw('diff', '--', 'package.json'); // git diff -- package.json

    const rgxDependencies = /"dependencies":\s*{[\s\S]*?}/; // regex to get "dependencies": {BLABLA}

    const dependenciesMatch = result.match(rgxDependencies);

    const dependenciesString = dependenciesMatch?.[0];
    if (!dependenciesString) return null;

    const rgxDependency = /^\s*\+\s*(.+?),$/; // regex to clean '+        "@adobe/leonardo-contrast-colors": "^1.0.0",' to "@adobe/leonardo-contrast-colors": "^1.0.0"

    const dependenciesArr = dependenciesString
        .split('\n')
        .map((dep) => {
            const dependencyMatch = dep.match(rgxDependency);
            if (!dependencyMatch) return null;
            return dependencyMatch[1] || null;
        })
        .filter((dep2) => dep2 !== null);

    const dependencyNames = dependenciesArr.map((dep) => dep.split(':')[0].replaceAll('"', ''));
    return dependencyNames;
}

export async function readFileOnLastCommit(filePath: string) {
    const listCommits = (await getHistoryCommitOfFile2(filePath))
        .map((fileOriginal) => ({ ...fileOriginal, dateNum: new Date(fileOriginal.date).getTime() }))
        .sort((fileA, fileB) => fileB.dateNum - fileA.dateNum); // sort descending

    const lastCommits = listCommits[0];

    if (!lastCommits) return null;
    // const fileName = path.basename(filePath);
    // process.platform === 'win32';

    let filePathInProject = filePath.replace(process.cwd(), '');
    filePathInProject = process.platform === 'win32' ? filePathInProject.replaceAll(path.win32.sep, '/') : filePathInProject; // if windows replace backslash to slah
    filePathInProject = filePathInProject
        .split('/')
        .filter((sec) => sec !== '')
        .join('/'); // clean first separator at begin

    // cwd result eg: C:\Backup drive E\my code\playground-nextjs-two\src\components\layout\data-nav.ts

    const fileContent = await git().raw('show', `${lastCommits.hash}:${filePathInProject}`);
    // return path.parse(filePath);
    return { content: fileContent, lastCommitDate: lastCommits.date };
}

export type ComparePackageJson = {
    dependencies: {
        name: string;
        type: 'dependency' | 'devdependency';
        isNew: boolean;
        isDelete: boolean;
    }[];
    lastCommitDate: string | undefined;
};
export async function comparePackageJson(): Promise<ComparePackageJson> {
    type PackageJsonShape = { dependencies: Record<string, string>; devDependencies: Record<string, string> };

    const pathPackageJson = path.join(cwd(), 'package.json');

    //* Read Previous and Current package.json
    const packagePrevious = await readFileOnLastCommit(pathPackageJson);
    if (!packagePrevious) return { dependencies: [], lastCommitDate: undefined } satisfies ComparePackageJson /* satisfies typeof depencyWithMeta */;
    const packageCurrent = await fsp.readFile(pathPackageJson, 'utf-8');

    //* Previous
    const packagePreviousObj = JSON.parse(packagePrevious.content) as PackageJsonShape;
    const dependenciesPreviousSet = new Set(Object.keys(packagePreviousObj.dependencies));
    const dependenciesDevPreviousSet = new Set(Object.keys(packagePreviousObj.devDependencies));

    //* Current
    const packageCurrentObj = JSON.parse(packageCurrent) as PackageJsonShape;
    const dependenciesCurrentSet = new Set(Object.keys(packageCurrentObj.dependencies));
    const dependenciesDevCurrentSet = new Set(Object.keys(packageCurrentObj.devDependencies));

    //* Combine
    const dependenciesCombinedSet = new Set([...dependenciesPreviousSet, ...dependenciesCurrentSet]);
    const dependenciesDevCombinedSet = new Set([...dependenciesDevPreviousSet, ...dependenciesDevCurrentSet]);

    const dependencies = Array.from(dependenciesCombinedSet).map((dependency) => {
        const current = dependenciesCurrentSet.has(dependency) ? dependency : null;
        const previous = dependenciesPreviousSet.has(dependency) ? dependency : null;
        return {
            name: dependency,
            type: 'dependency' as 'dependency',
            isNew: current && previous == null ? true : false,
            isDelete: current == null && previous ? true : false,
        };
    });

    const dependenciesDev = Array.from(dependenciesDevCombinedSet).map((devDependency) => {
        const current = dependenciesDevCurrentSet.has(devDependency) ? devDependency : null;
        const previous = dependenciesDevPreviousSet.has(devDependency) ? devDependency : null;
        return {
            name: devDependency,
            type: 'devdependency' as 'devdependency',
            isNew: current && previous == null ? true : false,
            isDelete: current == null && previous ? true : false,
        };
    });

    const depencyWithMeta: ComparePackageJson = {
        dependencies: [...dependencies, ...dependenciesDev],
        lastCommitDate: packagePrevious.lastCommitDate as string | undefined,
    };

    return depencyWithMeta;
}
