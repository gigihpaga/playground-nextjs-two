'use server';

import {
    type UntrackedAndModifiedFile as _UntrackedAndModifiedFile,
    getUntrackedAndModifiedFiles as _getUntrackedAndModifiedFiles,
} from '@/server/git-command';

export type UntrackedAndModifiedFile = _UntrackedAndModifiedFile;

export async function getUntrackedAndModifiedFiles() {
    return _getUntrackedAndModifiedFiles();
}
