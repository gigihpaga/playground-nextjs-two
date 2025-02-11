'use server';

import path from 'path';

import { getHistoryCommitOfFile2 as _getHistoryCommitOfFile2, getFilesFromCommit as _getFilesFromCommit } from '@/server/git-command';
import { type UntrackedAndModifiedFile, getUntrackedAndModifiedFiles } from '@/server/git-command';
import { getPathFileCurrentProject, type FileExplorer } from '@/utils/get-path-file-current-project';

export async function getHistoryCommitOfFile(pathFile: string, options: { cwd: boolean } = { cwd: true }) {
    const resolvedPath = options.cwd ? path.join(process.cwd(), pathFile) : pathFile;
    console.log('getHistoryCommitOfFile:resolvedPath=>', { pathFile, resolvedPath });
    return await _getHistoryCommitOfFile2(resolvedPath);
}

export async function getFilesFromCommit(hash: string) {
    return await _getFilesFromCommit(hash);
}

export type HistoryCommitFileInCurrentProject = FileExplorer & { status: UntrackedAndModifiedFile['status'] | 'unchange' };

export async function getHistoryCommitFileInCurrentProject() {
    const filesInCurrentProject = await getPathFileCurrentProject();
    const filesInGit = await getUntrackedAndModifiedFiles();

    // Create a lookup map for faster status checking
    const gitStatusMap = new Map(filesInGit.map((file) => [file.path, file.status]));

    const files: HistoryCommitFileInCurrentProject[] = filesInCurrentProject
        .filter((fcp) => fcp.type === 'file')
        .map((fcp) => {
            const status = gitStatusMap.get(fcp.path) || ('unchange' as const);
            return {
                ...fcp,
                status: status,
            };
        });

    return files;
}
