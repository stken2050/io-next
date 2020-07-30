interface IO {
    type: string;
    ev: {
        register: Function;
        trigger: Function;
    };
    now: any;
    next: any;
    "->": Function;
}
declare const IO: (initFunction?: Function) => any;
export { IO };
