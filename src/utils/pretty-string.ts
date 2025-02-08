/**
 * transform any string text to pascal case
 * @param input {String}
 * @returns string
 * @example
 * ```ts
 * const text = "user credential-be-f0or rE*lo#a4d"
 * const passcalCase = textToPascalCase(text) // UserCredentialBeForReload
 * ```
 */

export function textToPascalCase(input: string) {
    //let cleanedString = input.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove non-alphanumeric characters
    //let cleanedString = input.replace(/\W/g, '');
    let cleanedString = input
        .replace(/[-_]/g, ' ') // replace "-" & "_" to space
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphanumeric characters & number
        .split(/\s+/) // Split the string into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word (pascal case)
        .join(''); // Join the words together
    return cleanedString;
}
