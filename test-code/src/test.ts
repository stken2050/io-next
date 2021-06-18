import { IO, next } from "../../code/dist/io-next.js";
import { allThenResetIO } from "../../code/dist/allThenResetIO.js";

const right = a => b => b;
const log = msg => right
  (console.log(msg))
  (msg);

const customOperator = op => f => set =>
  Object.defineProperty(set, op, {
    value: function (a) {
      return f(a)(this);
    }
  });//returns new set/object

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
    expectedIO |> next([3, 9]);
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


"============================"|>log;
const A = IO(undefined);

const B = A
['>>'](a => a * 2)
['>>'](log);

const C = A['>>'](log);

A |> next(3)
  |> next(5);


Function.prototype |>
  customOperator('.')
    (g => f => x => x |> f |> g);
Function.prototype |>
  customOperator('..')
    (g => f => x => IO(x)['>>'](f)['>>'](g));


{
  "============================"|>log;
  "==monad laws================"|>log;
  "============================"|>log;

  {
    "associativity------"|>log;

    const f1 = a => a * 2;
    const f2 = a => a + 1;
    {
      IO(1)['>>'](f1)['>>'](f2)
      ['>>'](log);
    }
    {//endofunctor
      IO(1)['>>'](x => x|> f1|> f2)
      ['>>'](log);

      IO(1)['>>']((f1)['.'](f2))
      ['>>'](log);
    }
    {
      IO(1)['>>'](x => IO(x)['>>'](f1)['>>'](f2))
      ['>>'](log);

      IO(1)['>>']((f1)['..'](f2))
      ['>>'](log);
    }
    {//composition is point free
      "monad composition"|> log;

      const io1 =
        IO['..'](f1)['..'](f2)['..'](log);

      1 |> io1;

      const io2 =
        (f1)['..'](f2)['..'](log);

      1 |> io2;

      const io3 =
        (f1)['..'](f2)['..'](log)['..'](IO);

      1 |> io3;
    }
  }
  {
    "associativity Monad Function------"|>log;

    const f1 = a => IO(a * 2);
    const f2 = a => IO(a + 1);
    {
      IO(1)['>>'](f1)['>>'](f2)
      ['>>'](log);
    }
    {
      IO(1)['>>'](x => IO(x)['>>'](f1)['>>'](f2))
      ['>>'](log);

      IO(1)['>>']((f1)['..'](f2))
      ['>>'](log);
    }
  }
  {
    "associativity Monad Function Monad value------"|>log;

    const f1 = a => a['>>'](a => IO(IO(a * 2)));
    const f2 = a => a['>>'](a => IO(IO(a + 1)));
    const a = IO(1);
    {
      IO(a)['>>'](f1)['>>'](f2)
      ['>>'](log)['>>'](log);
    }
    {
      IO(a)['>>'](x => IO(x)['>>'](f1)['>>'](f2))
      ['>>'](log)['>>'](log);

      IO(a)['>>']((f1)['..'](f2))
      ['>>'](log)['>>'](log);
    }
  }
  {
    "idientiry left-right-- m * f ----"|>log;

    const f = a => IO(a * 2);

    //left  e * f = f
    const left = 1 |>
      (IO)['..'](f);

    //center  f
    const center = 1 |>
      f;

    //right  m * e = m
    const right = 1 |>
      (f)['..'](IO);

    left['>>'](log);
    center['>>'](log);
    right['>>'](log);
  }
}

{
  "equations ------"|>log;

  const a = IO(1);

  const b = a['>>'](a => a * 2);

  const c =
    a['>>'](a =>
      b['>>'](b => a + b));

  const aLog = a['>>'](log);
  const bLog = b['>>'](log);
  const cLog = c['>>'](log);

  a|> next(10);
  a|> next(100);
}

