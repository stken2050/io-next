const log = (msg) => (console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
    , msg);
const right = (a) => (b) => b;
const third = (a) => (b) => (c) => c;
//lazy io declaration = call by need for each io
const io = (ev) => // empty events
 ((currentVal) => ({
    type: "monad",
    get now() {
        return currentVal;
    },
    set next(nextVal) {
        this.trigger(currentVal = nextVal);
    },
    "->": function (f) {
        return operator(this)(f); // leftIO['->'](f) = newIO
    },
    register: (f) => (ev[ev.length] = f),
    trigger: (val) => ev.map((f) => f(val))
}))(undefined); //currentVal
const operator = // leftIO['->'](f) = newIO
 (leftIO) => (f) => IO((selfIO) => ((ff) => third(leftIO.register(ff)) //<1> register the sync function
(ff(leftIO.now)) //<2> trigger sync-self on joint
(selfIO.now) //<3> return init value on joint
)(monadF(f)(selfIO)) //ff
);
const monadF = (f) => (selfIO) => ((val) => val === undefined
    ? undefined
    : ((nextVal) => 
    // RightIdentity: join/flat = TTX => TX
    (nextVal === undefined
        ? undefined
        : nextVal.type === "monad"
            ? nextVal['->']((val) => selfIO.next = val)
            : selfIO.next = nextVal /*&& (log(self.now))*/))(f(val)) //nextVal
);
const IO = (initFunction = (io) => undefined) => ((io) => right(io.next = initFunction(io))(io) // return the normalized io(reactive) monad
)(io([])); //call by need for each empty events
export { IO };
