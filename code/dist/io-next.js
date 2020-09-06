const right = (a) => (b) => b;
const log = (msg) => right(console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg)))(msg);
//----------------------------
// dirty object hack
const customOperator = (op) => (f) => (set) => right(Object.defineProperty(set, op, {
    value: function (a) {
        return f(a)(this);
    },
    enumerable: false,
    configurable: false,
    writable: false
}))(set);
//-------------------------
const fa = (a) => (f) => a === undefined
    ? undefined
    : f(a);
const flatRegister = (f) => (A) => // flatRegister(f): A => B
 (B => right(A.list = //mutable
    A.list //add B-function to A-list
        .concat((a) => flatTrigger(fa(a)(f))(B)))((flatTrigger(fa(A.lastVal)(f))(B))))(IO(undefined)); //B = new IO
const flatTrigger = (a) => (A) => a === undefined
    ? A
    : a.type === "monad" //flat TTX=TX
        ? trigger(a.lastVal)(A)
        : trigger(a)(A);
const trigger = (a) => (A) => right(right(A.lastVal = a) //mutable
(A.list.map((f) => fa(a)(f))) //trigger f in list
)(A);
//spreadsheel cell corresponds to IO
//the last element of infinite list (git)
//https://en.wikipedia.org/wiki/Persistent_data_structure
const IO = (a) => customOperator('>>')(flatRegister)(({
    lastVal: a,
    list: [],
    type: "monad"
}));
const next = flatTrigger;
export { IO, next };
