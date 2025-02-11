import path from 'node:path';
import process from 'node:process';

import fastGlob from 'fast-glob';

export type FileExplorer = {
    path: string;
    fullPath: string;
    name: string;
    type: 'file' | 'directory';
    // size?: number; // bytes
};

export async function getPathFileCurrentProject(): Promise<FileExplorer[]> {
    const projectRoot = process.cwd(); // "C:\Backup drive E\my code\playground-nextjs-two"
    const projectRootNormalize = fastGlob.convertPathToPattern(projectRoot); // "C:/Backup drive E/my code/playground-nextjs-two"

    const sourcePattern = [path.join(projectRoot, 'src', '**', '*'), path.join(projectRoot, 'public', '**', '*')];
    const ignorePattern = [
        'node_modules',
        '.contentlayer',
        '.husky',
        '.git',
        '.next',
        '.qodo',
        '.storybook',
        '.vscode',
        'documentation',
        'playground',
        // 'public',
        // 'prisma',
        // 'src',
        // 'cli'
    ];

    const files = await fastGlob('**', {
        ignore: ignorePattern,
        stats: true,
        dot: true,
        cwd: projectRootNormalize,
    });

    return files.map((file) => {
        return {
            // path: path.relative(projectRoot, file.path),
            path: file.path,
            fullPath: path.posix.join(projectRootNormalize, file.path),
            name: path.basename(file.path),
            type: file.stats?.isDirectory() === true ? 'directory' : 'file',
            // size: file.stats?.size,
        } satisfies FileExplorer;
    });
}
