/** Dictionary type: a JavaScript object where properties are used as a key-value collection. */
export interface Dictionary<T> { [key: string]: T | undefined }

// Re-declaration of Object.values() and Object.entries() so that they do not return "undefined", but only T instead.
declare global {
    interface ObjectConstructor {
        /**
         * Returns an array of values of the enumerable properties of an dictionary
         * @param o Dictionary that contains the properties and methods.
         */
        values<T>(o: Dictionary<T>): Exclude<T, undefined>[];

        /**
         * Returns an array of key/values of the enumerable properties of an dictionary
         * @param o Dictionary that contains the properties and methods.
         */
        entries<T>(o: Dictionary<T>): [string, Exclude<T, undefined>][];
    }
}