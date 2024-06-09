const { quote } = require('shell-quote');
const { ESLint } = require('eslint');

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

module.exports = {
  /**
   * @param {string[]} filenames
   * _@returns {string[]}
   */
  '*.{js,ts}': async (filenames) => {
    const escapedFileNames = getEscapedFileNames(filenames);
    const eslintFileNames = await getEslintFileNames(filenames);
    return [
      `prettier --with-node-modules --ignore-path .prettierignore --write ${escapedFileNames}`,
      `prettier --with-node-modules --ignore-path .prettierignore --check ${escapedFileNames}`,
      `tsc-files --noEmit ${escapedFileNames}`,
      `eslint --no-ignore --max-warnings=0 --fix ${eslintFileNames}`,
    ];
  },
  /**
   * @param {string[]} filenames
   * _@returns {string[]}
   */
  '*.{jsx,tsx}': async (filenames) => {
    const escapedFileNames = getEscapedFileNames(filenames);
    const eslintFileNames = await getEslintFileNames(filenames);
    return [
      `prettier --with-node-modules --ignore-path .prettierignore --write ${escapedFileNames}`,
      `prettier --with-node-modules --ignore-path .prettierignore --check ${escapedFileNames}`,
      `tsc-files --noEmit ${escapedFileNames}`,
      `eslint --no-ignore --max-warnings=0 --fix ${eslintFileNames}`,
    ];
  },
  '*.{json,md,mdx,css,scss,sass}': ['prettier --write'],
};
