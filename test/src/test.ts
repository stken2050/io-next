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

  a |> next(3);

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
    expectedIO |> next([1, 5]);

    ioA |> next(9);
    ioA |> next(1);
    ioB |> next(5);
    //filled and cleared
  }
  {
    expectedIO |> next([9, 2]);
    ioA |> next(7);
    {
      ioA |> next(9);
      ioB |> next(2);
    } //filled and cleared
  }
  {
    expectedIO |> next([1, 9]);
    ioA |> next(1);
    {
      ioA |> next(undefined);
      {
        ioB |> next(9);
        ioA |> next(3);
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