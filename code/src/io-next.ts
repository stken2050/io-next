interface IO {
  type: string;
  now: unknown;
  next: unknown;
  "->": Function;
}

const log = (msg: unknown) => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

const right = (a: any) => (b: any) => b;
const third = (a: any) => (b: any) => (c: any) => c;

const events = (observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: unknown) =>
    observers.map((f: Function) => f(val))
});
//lazy io declaration = call by need for each io
const io = (ev: { register: Function, trigger: Function }) =>
  ((currentVal: unknown): IO => ({
    type: "monad",  //for TTX => TX
    get now() { //getter returns a value of now
      return currentVal;
    },
    set next(nextVal: unknown) {
      ev.trigger(currentVal = nextVal);
    }, //log("next:" + nextVal);
    "->": function (f: Function) {
      return operator(ev)(this)(f) // leftIO['->'](f) = newIO
    }// using function(), this, return inside object
  }))(undefined);//currentVal

const operator = // leftIO['->'](f) = newIO
  (ev: { register: Function, trigger: Function }) =>
    (leftIO: IO) => (f: Function) =>
      IO((self: IO) =>
        ((ff: Function) =>
          third
            (ev.register(ff))//<1> register the sync function
            (ff(leftIO.now)) //<2> trigger sync-self on joint
            (self.now)//<3> return init value on joint
        )(monadF(f)(self))//ff
      );

const monadF = (f: Function) => (self: IO) =>
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

const IO = (initFunction: Function = (io: IO) => undefined) =>
  ((io: IO) => right
    (io.next = initFunction(io))
    (io) // return the normalized io(reactive) monad
  )(io(events([]))); //call by need for each

export { IO };