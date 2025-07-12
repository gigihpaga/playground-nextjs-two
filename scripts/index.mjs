import { generatePaths } from './generate-app-paths.mjs';

/**
 * The main entry point for all pre-build scripts.
 * This function coordinates the execution of various build-related tasks.
 */
export async function main() {
    console.log('🚀 Starting pre-build scripts...');
    try {
        await generatePaths();
        // Jika ada skrip lain, panggil di sini:
        console.log('✅ All pre-build scripts completed successfully.');
    } catch (error) {
        console.error('❌ A pre-build script failed:', error);
        process.exit(1); // Exit with a failure code to stop the build process
    }
}

main();
