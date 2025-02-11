import fsp from 'node:fs/promises';
import path from 'node:path';

export function grabPackageName(text: string) {
    const rgxPackageName = /from\s['"](?<_pakageName>[^'"]+)['"]\s*;/gi;
    const rgxIsPackage = /^(?!@\/|\.\/|\.\.\/|~\/).*/; // "@/" "./" "../" "~/"
    const matches = text.matchAll(rgxPackageName);

    const packages: string[] = [];

    for (const match of matches) {
        const packageName = match.groups?._pakageName || '';

        if (!rgxIsPackage.test(packageName)) continue;
        packages.push(packageName);
    }

    return packages;
}

export async function readFileTextContent(filePath: string) {
    try {
        return await fsp.readFile(path.join(process.cwd(), filePath), 'utf-8');
    } catch (error) {
        console.log('error readFileTextContent', error);
        return '';
    }
}
