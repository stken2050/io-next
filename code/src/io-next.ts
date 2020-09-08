
const right = (a: any) => (b: any) => b;

const log = (msg: unknown) =>
  right
    (console.log(
      typeof msg === "function"
        ? msg
        : JSON.stringify(msg)))
    (msg);

const undefinedCheck = (a: unknown) => (a == null);// ==

//----------------------------
// dirty object hack
const customOperator =
  (op: string) =>
    (f: Function) =>
      (set: Object) => right
        (Object.defineProperty(
          set, op,
          {
            value: function (a: unknown) {
              return f(a)(this)
            },
            enumerable: false,
            configurable: false,
            writable: false
          })
        )
        (set);
//-------------------------

const fa = (a: unknown) => (f: Function) =>
  undefinedCheck(a)
    ? undefined
    : f(a);

const flatRegister = (f: Function) =>
  (A: IO) => // flatRegister(f): A => B
    (B => right
      (A.list = //mutable
        A.list//add B-function to A-list
          .concat((a: unknown) => B|> flatTrigger(fa(a)(f))))
      (B|> flatTrigger(fa(A.lastVal)(f)))
    )(IO(undefined)) //B = new IO

const flatTrigger = (a: unknown) => (A: IO) =>
  "lastVal" in Object(a)   //flat TTX=TX
    ? A|> trigger((a as IO).lastVal)
    : A|> trigger(a);

const trigger = (a: unknown) =>
  (A: IO) => right(right
    (A.lastVal = a) //mutable
    (A.list.map((f: Function) => fa(a)(f)))//trigger f in list
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
