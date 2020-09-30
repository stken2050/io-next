const right = <T>(a: T) => <U>(b: U) => b;

const log = (msg: unknown) =>
  right
    (console.log(msg))
    (msg);

const undefinedCheck = (a: unknown) => (a == null);// ==
const optionMap = (f: Function) => (a: unknown) =>
  undefinedCheck(a)
    ? undefined
    : f(a);

//----------------------------
// dirty object hack
const customOperator =
  (op: string) =>
    (f: Function) =>
      (set: Object) =>
        Object.defineProperty(set, op, {
          value: function (a: unknown) {
            return f(a)(this);
          }
        });
//-------------------------

const flatRegister = (f: Function) =>
  (A: IO) => // flatRegister(f): A => B
    (B => right
      (A.list = //mutable
        A.list//add B-function to A-list
          .concat((a: unknown) => B|> flatTrigger(a |> optionMap(f))))
      (B|> flatTrigger(A.lastVal |> optionMap(f)))
    )(IO(undefined)) //B = new IO

const flatTrigger = (a: unknown) => (A: IO) =>
  (aObject => // object | IO
    "lastVal" in aObject //pattern match
      ? A|> trigger(aObject.lastVal) //flat TTX=TX
      : A|> trigger(a)
  )(Object(a) as object | IO); //primitive wrapped into object

const trigger = (a: unknown) =>
  (A: IO) => right(right
    (A.lastVal = a) //mutable
    (A.list.map(f => a |> optionMap(f)))//trigger f in list
  )(A);

//spreadsheel cell corresponds to IO
//the last element of infinite list (git)
//https://en.wikipedia.org/wiki/Persistent_data_structure
const IO = (a: unknown): IO => ({
  lastVal: a, //mutable
  list: [], //mutable
})
  |> customOperator('>>')(flatRegister);

const next = flatTrigger;

interface IO {
  lastVal: unknown;
  list: Function[];
  ">>": Function;
}

export { IO, next };
