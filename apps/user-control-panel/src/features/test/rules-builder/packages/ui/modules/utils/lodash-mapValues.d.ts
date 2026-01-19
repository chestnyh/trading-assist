declare module "lodash/mapValues" {
  function mapValues<T extends object, TResult>(
    object: T | null | undefined,
    iteratee: (value: T[keyof T], key: string, collection: T) => TResult
  ): { [K in keyof T]: TResult };
  export default mapValues;
}

