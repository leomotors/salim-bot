// * String.ts : String Utility

export function trim(str: string): string {
    return str.replace(/^\s+/, "").toLowerCase();
}
