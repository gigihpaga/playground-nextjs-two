import process from 'node:process';
import path from 'node:path';

import fastGlob from 'fast-glob';

/**.
 *
 * @param __dirname - The absolute path to the project's root directory.  This is typically obtained using a similar function.
 * @returns A promise resolving to a sorted array of strings, where each string is a relative path to a page component file. Returns an empty array if no page files are found.
 * @throws Will throw an error if `fastGlob` encounters an issue during file searching.
 *
 * @example
 * const pagePaths = await getPathFilePage('/path/to/project'); // Replace with your actual project path.
 * // or
 * const __dirname = getDirName(import.meta.url);
 * const pathPages = await getPathFilePage(__dirname);
 * console.log(pagePaths); // Output: ['/path/to/page1', '/path/to/page2', ...]
 */
export async function getPathFilePage(__dirname: string) {
    const currentDirectory = pathNormalize(__dirname); // currentDirectory: 'C:/Backup drive E/my code/playground-nextjs-two/src/app/dev/research'
    const patern = pathNormalize(path.join(currentDirectory, '**', 'page.{tsx,jsx,js}')); // patern: 'C:/Backup drive E/my code/playground-nextjs-two/src/app/dev/research/**/page.{tsx,jsx,js}'
    const projectPath = pathNormalize(path.join(process.cwd(), 'src', 'app')); // projectPath: 'C:/Backup drive E/my code/playground-nextjs-two/src/app'

    const pathPages = await fastGlob(patern);

    const pathFolderPages = pathPages
        .map((absoluteFilePath) => {
            // absolutePath : C:/Backup drive E/my code/playground-nextjs-two/src/app/dev/research/history-charging/page.tsx
            const fileName = path.basename(absoluteFilePath); // fileName: 'page.tsx'
            const relativePath = path.relative(projectPath, absoluteFilePath); // relativePath: 'dev\research\history-charging\page.tsx'
            const folderPath = relativePath.replace(`${path.sep}${fileName}`, ''); // folderPage: 'dev\research\history-charging'
            const folderUrl = pathNormalize(path.join('/', folderPath)); // folderUrl: '/dev/research/history-charging'
            const folderUrlWithoutGroups = cleanRouteGroups(folderUrl);

            return folderUrlWithoutGroups;
        })
        .sort();
    return pathFolderPages;

    function pathNormalize(pathString: string) {
        return process.platform === 'win32' ? pathString.replace(/\\/g, '/') : pathString;
    }

    /**
     * clean paren group
     * 
     * example:
     * - input: '/dev/tutorial/code-bucks/bloging/(personal-info)/about'
     * - output:  '/dev/tutorial/code-bucks/bloging/about'
     * @param pathString 
     * @returns
     
     */
    function cleanRouteGroups(pathString: string) {
        // Regular expression to match parenthesized substrings.  The 'g' flag ensures all matches are found.
        const regex = /\/\(.*?\)/g; // patter: '/(any-word)'

        // Replace all matches with an empty string.
        return pathString.replace(regex, '');
    }
}
