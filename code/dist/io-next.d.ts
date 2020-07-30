interface IO {
    type: string;
    now: unknown;
    next: unknown;
    "->": Function;
}
declare const IO: (initFunction?: Function) => any;
export { IO };
