import fs from 'fs';
import path from 'path';
import { getPathFilePage } from '../src/utils/get-path-file-page.ts'; // Pastikan path ini benar

/**
 * Generates a JSON file containing a list of all page routes in the `src/app` directory.
 * This script reads the file system to find all `page.{ts,tsx,js,jsx}` files,
 * normalizes their paths, and writes the result to `src/generated/app-paths.json`.
 * It's intended to be run as a pre-build step to provide a static list of routes to the application.
 */
export async function generatePaths() {
    console.log('Generating app paths...');

    // 1. Tentukan path sumber dan tujuan
    const sourceDir = path.join(process.cwd(), 'src', 'app');
    const outputDir = path.join(process.cwd(), 'src', 'generated');
    const outputFile = path.join(outputDir, 'app-paths.json');

    // 2. Dapatkan data path
    const paths = (await getPathFilePage(sourceDir)).map((url) => ({ url }));

    // 3. Pastikan direktori tujuan ada
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 4. Tulis data ke file JSON
    fs.writeFileSync(outputFile, JSON.stringify(paths, null, 2));

    console.log(`✅ App paths generated successfully at ${outputFile}`);
}
