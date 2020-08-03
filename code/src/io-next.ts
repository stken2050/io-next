interface IO {
  type: string;
  now: unknown;
  next: unknown;
  "->": Function;
  register: Function;
  trigger: Function;
}

const log = (msg: unknown) => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

const right = (a: any) => (b: any) => b;
const third = (a: any) => (b: any) => (c: any) => c;

//lazy io declaration = call by need for each io
const io = (ev: Function[]) =>// empty events
  ((currentVal: unknown): IO => ({
    type: "monad",  //for TTX => TX
    get now() { //getter returns a value of now
      return currentVal;
    },
    set next(nextVal: unknown) {
      this.trigger(currentVal = nextVal);
    }, //log("next:" + nextVal);
    "->": function (f: Function) {
      return operator(this)(f) // leftIO['->'](f) = newIO
    },// using function(), this, return inside object
    register: (f: Function) => (ev[ev.length] = f),
    trigger: (val: unknown) => ev.map((f: Function) => f(val))
  }))(undefined);//currentVal

const operator = // leftIO['->'](f) = newIO
  (leftIO: IO) => (f: Function) =>
    IO((selfIO: IO) =>
      ((ff: Function) =>
        third
          (leftIO.register(ff))//<1> register the sync function
          (ff(leftIO.now)) //<2> trigger sync-self on joint
          (selfIO.now)//<3> return init value on joint
      )(monadF(f)(selfIO))//ff
    );

const monadF = (f: Function) => (selfIO: IO) =>
  ((val: unknown) =>
    val === undefined
      ? undefined
      : ((nextVal: undefined | IO) =>
        // RightIdentity: join/flat = TTX => TX
        (nextVal === undefined
          ? undefined
          : nextVal.type === "monad"
            ? nextVal['->']((val: unknown) =>
              selfIO.next = val)
            : selfIO.next = nextVal /*&& (log(self.now))*/
        ))(f(val))//nextVal
  );

const IO = (initFunction: Function = (io: IO) => undefined) =>
  ((io: IO) => right
    (io.next = initFunction(io))
    (io) // return the normalized io(reactive) monad
  )(io([])); //call by need for each empty events

export { IO };