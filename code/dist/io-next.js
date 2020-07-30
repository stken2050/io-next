const log = (msg) => (console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
    , msg);
const right = (a) => (b) => b;
const third = (a) => (b) => (c) => c;
const events = (observers) => ({
    register: (f) => (observers[observers.length] = f),
    trigger: (val) => observers.map((f) => f(val))
});
//lazy io declaration = call by need for each io
const io = (ev) => ((currentVal) => ({
    type: "monad",
    get now() {
        return currentVal;
    },
    set next(nextVal) {
        ev.trigger(currentVal = nextVal);
    },
    "->": function (f) {
        return operator(ev)(this)(f); // leftIO['->'](f) = newIO
    } // using function(), this, return inside object
}))(undefined); //currentVal
const operator = // leftIO['->'](f) = newIO
 (ev) => (leftIO) => (f) => IO((self) => ((ff) => third(ev.register(ff)) //<1> register the sync function
(ff(leftIO.now)) //<2> trigger sync-self on joint
(self.now) //<3> return init value on joint
)(monadF(f)(self)) //ff
);
const monadF = (f) => (self) => ((val) => val === undefined
    ? undefined
    : ((nextVal) => 
    // RightIdentity: join/flat = TTX => TX
    (nextVal === undefined
        ? undefined
        : nextVal.type === "monad"
            ? nextVal['->']((val) => self.next = val)
            : self.next = nextVal /*&& (log(self.now))*/))(f(val)) //nextVal
);
const IO = (initFunction = (io) => undefined) => ((io) => right(io.next = initFunction(io))(io) // return the normalized io(reactive) monad
)(io(events([]))); //call by need for each
export { IO };
