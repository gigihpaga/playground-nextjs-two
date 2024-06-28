import { quote } from 'shell-quote';
import { ESLint } from 'eslint';

const eslint = new ESLint();

/**
 * Escape filenames to ensure that spaces and such aren't interpreted as
 * separators.
 *
 * @param {string[]} filenames
 * @returns {string[]}
 */
function escape(filenames) {
    if (process.platform === 'win32') {
        return filenames;
    }

    return filenames.map((filename) => quote([filename]).replace(/\\@/g, '@'));
}

/**
 * @param {string[]} filenames
 *  @returns {Promise<string>}
 */
async function getEslintFileNames(filenames) {
    // eslint-disable-next-line no-undef
    const _eslintFileNames = await Promise.all(
        filenames.map(async (filename) => {
            const ignored = await eslint.isPathIgnored(filename);
            return ignored ? null : filename;
        })
    );

    const eslintFileNames = _eslintFileNames
        .filter((filename) => filename !== null)
        .map((filename) => {
            // eslint-disable-next-line no-useless-escape
            return `\"${filename}\"`;
        })
        .join(' ');

    return eslintFileNames;
}

/**
 * @param {string[]} filenames
 * @returns {string}
 */

function getEscapedFileNames(filenames) {
    const escapedFileNames = escape(filenames)
        // eslint-disable-next-line no-undef, no-useless-escape
        .map((f) => `\"${f}\"`)
        .join(' ');

    return escapedFileNames;
}

const getTscFlags = () => {
    const compilerOptions = {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        // incremental: true,
    };

    return Object.keys(compilerOptions)
        .flatMap((key) => {
            const value = compilerOptions[key];
            if (Array.isArray(value)) {
                return `${key} ${value.join(',')}`;
            }
            if (typeof value === 'string') {
                return `${key} ${value}`;
            }
            return key;
        })
        .map((key) => `--${key}`)
        .join(' ');
};

const lintStaggedConfig = {
    /**
     * @param {string[]} filenames
     * _@returns {string[]}
     */
    '*.{js,mjs,cjs,jsx}': async (filenames) => {
        const escapedFileNames = getEscapedFileNames(filenames);
        const eslintFileNames = await getEslintFileNames(filenames);
        return [
            `prettier --with-node-modules --ignore-path .prettierignore --write ${escapedFileNames}`,
            `prettier --with-node-modules --ignore-path .prettierignore --check ${escapedFileNames}`,
            `eslint --no-ignore --max-warnings=0 ${eslintFileNames}`,
            // `eslint --no-ignore --max-warnings=0 --fix ${eslintFileNames}`, // tidak perlu di FIX, kalo di FIX otomatis nanti tidak tau apa yang dirubah sama eslint
            // `tsc --noEmit ${getTscFlags()} ${escapedFileNames}`,
            'tsc --noEmit',
            // `tsc --noEmit ${escapedFileNames}`,
            // `npx tsc-files --noEmit ${escapedFileNames}`,
            // 'bash -c tsc --noEmit --skipLibCheck',
        ];
    },
    /**
     * @param {string[]} filenames
     * _@returns {string[]}
     */
    '*.{ts,tsx}': async (filenames) => {
        const escapedFileNames = getEscapedFileNames(filenames);
        const eslintFileNames = await getEslintFileNames(filenames);
        return [
            `prettier --with-node-modules --ignore-path .prettierignore --write ${escapedFileNames}`,
            `prettier --with-node-modules --ignore-path .prettierignore --check ${escapedFileNames}`,
            `eslint --no-ignore --max-warnings=0 ${eslintFileNames}`,
            // `eslint --no-ignore --max-warnings=0 --fix ${eslintFileNames}`, // tidak perlu di FIX, kalo di FIX otomatis nanti tidak tau apa yang dirubah sama eslint
            // `tsc --noEmit ${getTscFlags()} ${escapedFileNames}`,
            'tsc --noEmit',
            // `tsc --noEmit ${escapedFileNames}`,
            // `npx tsc-files --noEmit ${escapedFileNames}`,
            // 'bash -c tsc --noEmit --skipLibCheck',
        ];
    },
    '*.{json,md,mdx,css,scss,sass}': ['prettier --ignore-path .prettierignore --write'],
};

export default lintStaggedConfig;
