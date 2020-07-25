import { IO } from "../code/dist/io-next.js";
import { allThenResetIO } from "../code/dist/allThenResetIO.js";

//instant fill
const ioOf = (a) => IO(self => a);

const match = (io1) => (io2) =>
  io1.now.type === undefined
    ? (expect(
      io1.now
    ).toBe(
      io2.now
    ))
    : (expect(
      io1.now.now
    ).toBe(
      io2.now.now
    ));

const str = io1 => io2 =>
  io1.now.type === undefined
    ? "matching: " + io1.now
    + " === " + io2.now
    : "matching: " +
    "ioOf(" + io1.now.now + ")"
    + " === " +
    "ioOf(" + io2.now.now + ")";

const monadTest = (a) =>
  (f) => (g) => {

    describe("Left Identity", () => {

      const io1 =
        ioOf(a)['->'](f);

      const io2 =
        f(a);

      test(str(io1)(io2), () =>
        match(io1)(io2)
      )

    });

    describe("Right Identity", () => {

      const io1 =
        f(a);

      const io2 =
        f(a)['->'](ioOf)

      test(str(io1)(io2), () =>
        match(io1)(io2)
      )

    });


    describe("Associativity", () => {

      const io1 =
        ioOf(a)
        ['->'](f)
        ['->'](g);

      const io2 =
        ioOf(a)
        ['->'](b => ioOf(b)
        ['->'](f)
        ['->'](g));

      test(str(io1)(io2), () =>
        match(io1)(io2)
      )

    });


  };

const compose =
  f => g =>
    a => g(f(a));

const f = (a) => (a * 2);
const g = (a) => (a + 1);

{
  const a = 1;
  const fio = compose(f)(ioOf);
  const gio = compose(g)(ioOf);

  monadTest(a)(fio)(gio);
}
{
  const a = ioOf(5);

  const fio = compose
    ((a) => (a['->'](f)))
    (ioOf);

  const gio = compose
    ((a) => (a['->'](g)))
    (ioOf);

  monadTest(a)(fio)(gio);
}
