import { IO, next } from "../../code/dist/io-next.js";
import { allThenResetIO } from "../../code/dist/allThenResetIO.js";
{
    {
        const a = IO(99);
        a['>>'](console.log);
        console.log("code finished");
    }
    const a = IO(undefined);
    const b = a['>>']((a) => a * 2);
    next(3)(a);
    const Log = b['>>'](console.log);
}
{
    const ioA = IO(undefined);
    const ioB = IO(undefined);
    const ioAB = allThenResetIO([ioA, ioB]);
    ioAB['>>'](console.log);
    const expectedIO = IO(undefined);
    expectedIO['>>'](console.log);
    {
        next([1, 5])(expectedIO);
        next(9)(ioA);
        next(1)(ioA);
        next(5)(ioB);
        //filled and cleared
    }
    {
        next([9, 2])(expectedIO);
        next(7)(ioA);
        {
            next(9)(ioA);
            next(2)(ioB);
        } //filled and cleared
    }
    {
        next([1, 9])(expectedIO);
        next(1)(ioA);
        {
            next(undefined)(ioA);
            {
                next(9)(ioB);
                next(3)(ioA);
            } //filled and cleared
        }
    }
}
/*
const log = msg => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

{

  const a = IO();
  a['>>'](log)['>>'](log);


}
{

  const a = IO(self => 1)//['>>'](a => a * 2);
  //const b = a['>>'](a => a * 2);


  a['>>'](a => log("a:" + a))
  a['>>'](log)['>>'](log);


  a |> next(undefined;
  a |> next(7;

  a |> next(undefined;

}
//console.log(a  .lastVal);
//console.log(b  .lastVal);
//b['>>'](console.log);

*/ 
