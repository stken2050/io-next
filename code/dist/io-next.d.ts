declare type Undefindable<T> = NonNullable<T> | undefined;
declare const IO: <T>(a: Undefindable<T>) => IO;
declare const next: <T>(a: Undefindable<T>) => (A: IO) => IO;
interface IO {
    lastVal: unknown;
    list: Function[];
    ">>": Function;
}
export { IO, next };
