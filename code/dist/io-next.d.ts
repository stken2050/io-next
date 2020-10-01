declare type Option<T> = NonNullable<T> | undefined;
declare const IO: <T>(a: Option<T>) => IO;
declare const next: <T>(a: Option<T>) => (A: IO) => IO;
interface IO {
    lastVal: unknown;
    list: Function[];
    ">>": Function;
}
export { IO, next };
