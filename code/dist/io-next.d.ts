interface IO {
    type: string;
    now: unknown;
    next: unknown;
    "->": Function;
    register: Function;
    trigger: Function;
}
declare const IO: (initFunction?: Function) => any;
export { IO };
