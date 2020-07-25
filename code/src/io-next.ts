interface IO {
  type: string;
  now: any;
  next: any;
  sync: Function;
  "->": Function;
}

const third = (a: any) => (b: any) => (c: any) => c;

const log = (msg: unknown) => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

const events = (observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: any) =>
    observers.map((f: Function) => f(val))
});

const syncF = (io: IO) =>
  (f: Function) =>
    (self: IO) =>
      ((val: unknown) =>
        val === undefined
          ? undefined
          : ((nextVal: undefined | IO) =>
            // RightIdentity: join = TTX => TX
            (nextVal === undefined
              ? undefined
              : (nextVal.type === io.type)
                ? nextVal.sync((val: unknown) =>
                  self.next = val)
                : (self.next = nextVal) /*&& (log(self.now))*/
            ))(f(val))//nextVal
      );

const IO = (initFunction: Function =
  (io: IO) => undefined): IO => {
  const io = ((currentVal: any) => (ev: any) => ({
    type: "io-monad",  //for TTX => TX
    get now() { //getter returns a value of now
      return currentVal;
    },
    set next(nextVal: unknown) {
      ev.trigger(currentVal = nextVal);
    }, //log("next:" + nextVal);
    sync: (f: Function) =>
      IO((self: IO) =>
        ((ff: Function) =>
          third //<1> first, register the sync function
            (ev.register(ff))
            //<2> trigger self by the left operand on joint
            (ff(io.now))
            (self.now)//<3> returns init value on joint
        )(syncF(io)(f)(self))//ff
      ),
    "->": (f: Function) => io.sync(f)
  }))(undefined)(events([]));
  //just initialization and no trigger since there's no sync yet
  io.next = initFunction(io);
  return io;
};

export { IO };