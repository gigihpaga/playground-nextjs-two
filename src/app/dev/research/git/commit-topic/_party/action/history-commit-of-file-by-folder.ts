'use server';

import path from 'node:path';
import { cwd } from 'node:process';
import os from 'node:os';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import fastGlob from 'fast-glob';
import Bottleneck from 'bottleneck';

import { getHistoryCommitOfFile2, HistoryCommit } from '@/server/git-command';
import { getErrorMessage } from '@/utils/get-error-message';

// Create a limiter to control concurrency. This prevents overwhelming the system
// by spawning too many git processes at once.
// Adjust maxConcurrent based on your server's capabilities (10 is a good start).
const limiter = new Bottleneck({
    maxConcurrent: 10,
});

// Wrap the git command function with the limiter.
const limitedGetHistoryCommit = limiter.wrap(getHistoryCommitOfFile2);

export type HistoryCommitOfFileByFolder = {
    fullPath: string;
    name: string;
    path: string;
    commits: HistoryCommit[];
};

type GetHistoryCommitOfFileByFolderOption = {
    /** default true */
    cwd?: boolean;
    /** default false */
    recursive?: boolean;
};

export async function getHistoryCommitOfFileByFolder(pathFolder: string, options: GetHistoryCommitOfFileByFolderOption = {}) {
    const { cwd: isCwd = true, recursive: isRecursive = false } = options;

    const projectRoot = cwd();
    const projectRootNormalize = fastGlob.convertPathToPattern(projectRoot);
    const resolvedPath = isCwd ? path.join(projectRoot, pathFolder) : pathFolder;

    try {
        if (!fs.existsSync(resolvedPath)) throw new Error(`you search ${resolvedPath}, but this path not exist`);

        const stat = fs.statSync(resolvedPath);
        if (!stat.isDirectory()) throw new Error(`The path:${resolvedPath}, is not a folder`);

        // Scan semua file di dalam folder secara rekursif menggunakan fast-glob dengan pola: '**/*'
        // Scan semua file di dalam folder secara non-rekursif (file yang berada langsung di dalam folder) dengan pola: '*'
        const filePaths = await fastGlob(isRecursive ? '**/*' : '*', {
            stats: true,
            onlyFiles: true, // Hanya ambil file, bukan direktori
            absolute: true, // Kembalikan path absolut
            cwd: resolvedPath,
            followSymbolicLinks: false,
        });

        // Use the limiter to process files in parallel with controlled concurrency.
        // This is significantly faster than a sequential for...of loop.
        const promises = filePaths.map(async (file) => {
            const commits = await limitedGetHistoryCommit(file.path);
            return {
                path: file.path.replace(projectRootNormalize, ''),
                fullPath: file.path,
                name: path.basename(file.path),
                commits: commits,
            };
        });
        const fileWithHistoryCommit = await Promise.all(promises);

        return { data: fileWithHistoryCommit, error: null };
    } catch (error) {
        console.error('getHistoryCommitOfFileByFolder', error);
        // throw error; // Melemparkan kembali error agar bisa ditangani oleh pemanggil
        return { data: null, error: getErrorMessage(error) };
    }
}
