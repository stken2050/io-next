interface IO {
  type: string;
  ev: { register: Function, trigger: Function };
  now: any;
  next: any;
  "->": Function;
}

const log = (msg: unknown) => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

const customOperator =
  (op: string) =>
    (set: IO) =>
      (f: Function) =>
        Object.defineProperty(
          set, op,
          {
            value: function (a: unknown) {
              return f(this)(a)
            },
            enumerable: false,
            configurable: false,
            writable: false
          });

const identity = (a: any) => a;
const third = (a: any) => (b: any) => (c: any) => c;

const events = (observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: any) =>
    observers.map((f: Function) => f(val))
});

//lazy declaration = call by need for each io
const io = () => ((currentVal: any) => ({
  type: "monad",  //for TTX => TX
  ev: events([]),
  get now() { //getter returns a value of now
    return currentVal;
  },
  set next(nextVal: unknown) {
    this.ev.trigger(currentVal = nextVal);
  }, //log("next:" + nextVal);
  "->": identity  //just a placeholder for type
}))(undefined);

const IO = (initFunction: Function = (io: IO) => undefined) =>
  (
    (io: IO) => third
      (customOperator("->")(io)(
        (leftIO: IO) => (f: Function) => (
          IO((self: IO) =>
            ((ff: Function) =>
              third
                (leftIO.ev.register(ff))//<1> register the sync function
                (ff(leftIO.now)) //<2> trigger sync-self on joint
                (self.now)//<3> return init value on joint
            )(syncF(f)(self))//ff
          ))
      )) //just initialization and no trigger since there's no sync yet
      (io.next = initFunction(io))
      (io) //finally, return the normalized io(reactive) monad
  )(io()); //call by need for each

const syncF = (f: Function) => (self: IO) =>
  ((val: unknown) =>
    val === undefined
      ? undefined
      : ((nextVal: undefined | IO) =>
        // RightIdentity: join/flat = TTX => TX
        (nextVal === undefined
          ? undefined
          : nextVal.type === "monad"
            ? nextVal['->']((val: unknown) =>
              self.next = val)
            : self.next = nextVal /*&& (log(self.now))*/
        ))(f(val))//nextVal
  );

export { IO };