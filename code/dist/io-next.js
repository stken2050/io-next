const right = (a) => (b) => b;
const log = (msg) => right(console.log(msg))(msg);
const undefinedCheck = (a) => (a == null); // ==
//----------------------------
// dirty object hack
const customOperator = (op) => (f) => (set) => Object.defineProperty(set, op, {
    value: function (a) {
        return f(a)(this);
    }
});
//-------------------------
const fa = (a) => (f) => undefinedCheck(a)
    ? undefined
    : f(a);
const flatRegister = (f) => (A) => // flatRegister(f): A => B
 (B => right(A.list = //mutable
    A.list //add B-function to A-list
        .concat((a) => flatTrigger(fa(a)(f))(B)))((flatTrigger(fa(A.lastVal)(f))(B))))(IO(undefined)); //B = new IO
const flatTrigger = (a) => (A) => (aObject => // object | IO
 "lastVal" in aObject //pattern match
    ? trigger(aObject.lastVal)(A) //flat TTX=TX
 : trigger(a)(A))(Object(a)); //primitive wrapped into object
const trigger = (a) => (A) => right(right(A.lastVal = a) //mutable
(A.list.map((f) => fa(a)(f))) //trigger f in list
)(A);
//spreadsheel cell corresponds to IO
//the last element of infinite list (git)
//https://en.wikipedia.org/wiki/Persistent_data_structure
const IO = (a) => customOperator('>>')(flatRegister)(({
    lastVal: a,
    list: [],
}));
const next = flatTrigger;
export { IO, next };
