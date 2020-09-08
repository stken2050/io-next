declare const IO: (a: unknown) => IO;
declare const next: (a: unknown) => (A: IO) => any;
interface IO {
    lastVal: unknown;
    list: Function[];
    ">>": Function;
}
export { IO, next };
