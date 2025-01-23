import process from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Retrieves the directory name of a given URL or file path.  This is particularly useful in ES modules
 * where `__dirname` is not directly available.  The function converts a URL to a file path,
 * then extracts the directory portion using `path.dirname`.
 * @param metaUrl - The URL or file path of the module.  Typically obtained using `import.meta.url`.
 * @returns The directory name (path) as a string.  Returns an empty string if there is an error.
 *
 * @example
 * const __dirname = getDirName(import.meta.url)
 */

export function getDirName(metaUrl: string) {
    try {
        const __filename = fileURLToPath(metaUrl);
        const __dirname = path.dirname(__filename);
        return __dirname;
    } catch (error) {
        console.error('Error getting directory name:', error);
        return ''; // Or throw the error, depending on your error handling strategy
    }
}
