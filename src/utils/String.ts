// * String.ts : String Utility

// * Trim whitespace and convert to Lowercase
export function trim(str: string): string {
    return str.replace(/^\s+/, "").toLowerCase();
}
