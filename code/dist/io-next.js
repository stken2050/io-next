const log = (msg) => (console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
    , msg);
const customOperator = (op) => (set) => (f) => Object.defineProperty(set, op, {
    value: function (a) {
        return f(this)(a);
    },
    enumerable: false,
    configurable: false,
    writable: false
});
const identity = (a) => a;
const third = (a) => (b) => (c) => c;
const events = (observers) => ({
    register: (f) => (observers[observers.length] = f),
    trigger: (val) => observers.map((f) => f(val))
});
//lazy declaration = call by need for each io
const io = () => ((currentVal) => ({
    type: "monad",
    ev: events([]),
    get now() {
        return currentVal;
    },
    set next(nextVal) {
        this.ev.trigger(currentVal = nextVal);
    },
    "->": identity //just a placeholder for type
}))(undefined);
const IO = (initFunction = (io) => undefined) => ((io) => third(customOperator("->")(io)((leftIO) => (f) => (IO((self) => ((ff) => third(leftIO.ev.register(ff)) //<1> register the sync function
(ff(leftIO.now)) //<2> trigger sync-self on joint
(self.now) //<3> return init value on joint
)(syncF(f)(self)) //ff
)))) //just initialization and no trigger since there's no sync yet
(io.next = initFunction(io))(io) //finally, return the normalized io(reactive) monad
)(io()); //call by need for each
const syncF = (f) => (self) => ((val) => val === undefined
    ? undefined
    : ((nextVal) => 
    // RightIdentity: join/flat = TTX => TX
    (nextVal === undefined
        ? undefined
        : nextVal.type === "monad"
            ? nextVal['->']((val) => self.next = val)
            : self.next = nextVal /*&& (log(self.now))*/))(f(val)) //nextVal
);
export { IO };
