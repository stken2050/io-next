const right = (a) => (b) => b;
const log = (msg) => right(console.log(msg))(msg);
const undefinedCheck = (a) => (a === undefined) || (a === null);
const optionMap = (f) => (a) => undefinedCheck(a)
    ? undefined
    : f(a);
// dirty object hack
const customOperator = (op) => (f) => (set) => Object.defineProperty(set, op, {
    value: function (a) {
        return f(a)(this);
    }
});
//-------------------------
const flatRegister = (f) => (A) => // flatRegister(f): A => B
 ((B) => right(A.list = //mutable
    A.list //add B-function to A-list
        .concat((a) => flatTrigger(optionMap(f)(a))(B)))((flatTrigger(optionMap(f)(A.lastVal))(B))))(IO(undefined)); //B = new IO
const flatTrigger = (a) => (A) => (aObject => // object | IO
 "lastVal" in aObject //pattern match
    ? trigger(aObject.lastVal)(A) //flat TTX=TX
 : trigger(a)(A))(Object(a)); //primitive wrapped into object
const trigger = (a) => (A) => right(right(A.lastVal = a) //mutable
(A.list.map(f => optionMap(f)(a))) //trigger f in list
)(A);
//spreadsheel cell corresponds to IO
//the last element of infinite list (git)
//https://en.wikipedia.org/wiki/Persistent_data_structure
const IO = (a) => (customOperator('>>')(flatRegister)({
    lastVal: a,
    list: [] //mutable
}));
const next = flatTrigger;
export { IO, next };
