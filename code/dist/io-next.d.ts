interface IO {
    type: string;
    lastVal: unknown;
    list: Function[];
    ">>": Function;
}
declare const IO: (a: unknown) => IO;
declare const next: (a: unknown) => (A: IO) => any;
export { IO, next };
