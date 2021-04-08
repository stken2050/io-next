const right = <T>(a: T) => <U>(b: U) => b;

const log = (msg: unknown) =>
  right
    (console.log(msg))
    (msg);

type Option<T> = NonNullable<T> | undefined;

const undefinedCheck = <T>(a: Option<T>) =>
  (a === undefined) || (a === null);

const optionMap = (f: Function) =>
  <T>(a: Option<T>) =>
    undefinedCheck(a)
      ? undefined
      : f(a);

// dirty object hack
const customOperator =
  (op: string) =>
    (f: Function) =>
      (set: Object) =>
        Object.defineProperty(set, op, {
          value: function <T>(a: Option<T>) {
            return f(a)(this);
          }
        });
//-------------------------

const flatRegister = (f: Function) =>
  (A: IO) => // flatRegister(f): A => B
    ((B: IO) => right
      (A.list = //mutable
        A.list//add B-function to A-list
          .concat(<T>(a: Option<T>) => B|> flatTrigger(a |> optionMap(f))))
      (B|> flatTrigger(A.lastVal |> optionMap(f)))
    )(IO(undefined)) //B = new IO

const flatTrigger = <T>(a: Option<T>) => (A: IO) =>
  (aObject => // object | IO
    "lastVal" in aObject //pattern match
      ? A|> trigger(aObject.lastVal) //flat TTX=TX
      : A|> trigger(a)
  )(Object(a) as object | IO); //primitive wrapped into object

const trigger = <T>(a: Option<T>) =>
  (A: IO) => right(right
    (A.lastVal = a) //mutable
    (A.list.map(f => a |> optionMap(f)))//trigger f in list
  )(A);

//spreadsheel cell corresponds to IO
//the last element of infinite list (git)
//https://en.wikipedia.org/wiki/Persistent_data_structure
const IO = <T>(a: Option<T>) =>
  ({
    lastVal: a, //mutable
    list: [] //mutable
  } |> customOperator('>>')(flatRegister)) as IO;

const next = flatTrigger;

interface IO {
  lastVal: unknown;
  list: Function[];
  ">>": Function;
}

export { IO, next };
