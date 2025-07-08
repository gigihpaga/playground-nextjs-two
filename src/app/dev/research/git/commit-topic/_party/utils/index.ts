/**
 * Type guard to check if a value is a non-null object containing a string 'id' property.
 * @param value The value to check.
 * @returns `True` if the value is an object with a string id, false otherwise.
 */
export function isObjectWithId(value: unknown): value is { id: string; [key: string]: unknown } {
    return typeof value === 'object' && value !== null && 'id' in value && typeof (value as { id: unknown }).id === 'string';
}
