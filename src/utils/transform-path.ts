export type FileGit<T extends Record<string, unknown>> = T & {
    name: string;
    pathWithRoot: string;
    type: 'folder' | 'file';
    children: FileGit<T>[];
    counterFile?: number;
    key: string;
    // path:string
    // [K in keyof T]: T[K];
    // [K]: T[K];
};

/**
 * 
 * @param filesFlatPath 
 * @returns FileTree[]
 * @example
 ```ts
 // input
 const filesFlatPath: string[] = [
    { path: 'package.json' },
    { path: 'public/images/marvin-meyer.jpg' },
    { path: 'public/images/lauren-mancke.jpg' },
    { path: 'public/assets/bear.lottie' },
    { path: 'src/app/research/flow/_party/components/base-shape.tsx' },
    { path: 'src/app/research/flow/_party/components/context-menu.tsx' },
    { path: 'src/app/research/flow/page.tsx' },
    { path: 'src/app/research/color-wheel' },
    { path: 'src/app/tutorial/code-bucks/bloging/' },
];

const filesThreePath: FileTree[] = transformFlatPathToTree(filesFlatPath);

// output:
var filesThreePath: FileTree[] = [
    {
        name: 'root',
        type: 'folder',
        pathWithRoot: '/',
        key: '0',
        children: [
            {
                name: 'public',
                type: 'folder',
                pathWithRoot: 'root/public',
                key: '0-0',
                children: [
                    {
                        name: 'images',
                        type: 'folder',
                        pathWithRoot: 'root/public/images',
                        key: '0-0-0',
                        children: [
                            {
                                name: 'marvin-meyer.jpg',
                                type: 'file',
                                pathWithRoot: 'root/public/images/marvin-meyer.jpg',
                                key: '0-0-0-0',
                                children: [],
                            },
                            {
                                name: 'lauren-mancke.jpg',
                                type: 'file',
                                pathWithRoot: 'root/public/images/lauren-mancke.jpg',
                                key: '0-0-0-1',
                                children: [],
                            },
                        ],
                    },
                    {
                        name: 'assets',
                        type: 'folder',
                        pathWithRoot: 'root/public/assets',
                        key: '0-0-1',
                        children: [
                            {
                                name: 'bear.lottie',
                                type: 'file',
                                pathWithRoot: 'root/public/assets/bear.lottie',
                                key: '0-0-1-0',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
 ```
 */
export function generatePathTree<T extends Record<string, unknown> & { path: string }>(filesFlatPath: T[]) /* : FileTree[] */ {
    const root = {
        name: 'root',
        type: 'folder',
        pathWithRoot: '/',
        children: [] /* as Array<FileTree<T> & T> */,
        key: '0',
    } as unknown as FileGit<T>;

    let counterFile = 0;
    // console.log(filesFlatPath);

    for (const filePath of filesFlatPath) {
        // eslint-disable-next-line no-prototype-builtins
        if (!('path' in filePath)) throw new Error('object not have key: path');

        const pathParts = filePath.path.split('/');

        let currentLevel = root;

        for (const part of pathParts) {
            if (part === '') continue;

            let existingNode = currentLevel.children.find((node) => node.name === part);

            if (!existingNode) {
                const type = pathParts.indexOf(part) < pathParts.length - 1 ? 'folder' : 'file';

                const originalData = {
                    ...filePath,
                    path: type === 'folder' ? (currentLevel.pathWithRoot === '/' ? `${part}` : `${currentLevel.path}/${part}`) : filePath.path,
                };

                const newNode: FileGit<T> = {
                    counterFile: type === 'file' ? (counterFile += 1) : undefined, // ditaruh diatas (...filePath) agar direplace dari yang sudah ada
                    ...originalData,
                    key: `${currentLevel.key}-${currentLevel.children.length}`,
                    name: part,
                    type: type,
                    pathWithRoot: currentLevel.pathWithRoot === '/' ? `root/${part}` : `${currentLevel.pathWithRoot}/${part}`,
                    children: [],
                };
                currentLevel.children.push(newNode);
                currentLevel = newNode;
            } else {
                currentLevel = existingNode;
            }
        }
    }

    return [root] /* root.children */ /* as Array<FileTree & T> */;
}

// Flatten function to convert nested FileTree array to a flat arrayfunction flattenFileTree(fileTree: FileTree[]): FileTree[] {
export function transformPathTree2Flat<T extends Record<string, unknown> & { children: T[] }>(fileTree: T[], callbackFilter?: (data: T) => boolean) {
    const pathFlat = fileTree.reduce((accumulator, current) => {
        if (!('children' in current)) throw new Error('object not have key: children');

        accumulator.push(current);
        if (current.children && current.children.length > 0) {
            accumulator.push(...transformPathTree2Flat(current.children));
            // current.children = []; // Optional: Clear children after flattening
        }
        return accumulator;
    }, [] as T[]);

    if (callbackFilter instanceof Function) {
        return pathFlat.filter(callbackFilter);
    } else {
        return pathFlat;
    }
}

function transformFlatPathToTree2(filesFlatPath: string[]) /* : FileTree[] */ {
    const root: FileGit<{ [key: string]: unknown }> = {
        name: 'root',
        type: 'folder',
        pathWithRoot: '/',
        key: '0',
        children: [],
    };

    const addToTree = (filePath: string) => {
        const pathParts = filePath.split('/');
        let currentLevel = root;

        pathParts.forEach((part, index) => {
            if (part.trim() === '') return;

            const existingNode = currentLevel.children.find((node) => node.name === part);

            if (existingNode) {
                currentLevel = existingNode;
            } else {
                const newNode: FileGit<{ [key: string]: unknown }> = {
                    name: part,
                    type: index === pathParts.length - 1 ? 'file' : 'folder',
                    pathWithRoot: `${currentLevel.pathWithRoot}/${part}`,
                    key: `${currentLevel.key}-${currentLevel.children.length}`,
                    children: [],
                };

                currentLevel.children.push(newNode);
                currentLevel = newNode;
            }
        });
    };

    filesFlatPath.forEach(addToTree);

    return root.children;
}
