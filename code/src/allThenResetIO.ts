import { IO } from "./io-next.js";

const left = (a: any) => (b: any) => a;
const right = (a: any) => (b: any) => b;

const replace = (arr: number[]) =>
  (index: number) =>
    (val: number) =>
      [...arr.slice(0, index), val,
      ...arr.slice(index + 1)];

const mm = (A: number[]) => (B: number[]) =>
  A.map((a, index) => a * B[index]);

const allThenResetIO =
  (ios: IO[]): IO =>
    ((flagIO: IO) =>
      IO((self: IO) => left
        (undefined)
        (right
          (
            ios.map((io, index) =>
              io['->'](() =>
                ((uMask: number[]) =>
                  (target: number[]) =>
                    flagIO.next = mm(uMask)(target))
                  (ios.map(io =>
                    io.now === undefined ? 0 : 1))
                  (replace(flagIO.now as number[])(index)(1))
              )
            )
          )
          (
            flagIO['->'](
              (flags: number[]) =>
                self.next = //all  updated?
                (flags.reduce((a: number, b: number) => (a * b))
                  === 1)
                  ? left
                    (ios.map((io) => io.now))
                    (flagIO.next = Array(ios.length).fill(0))
                  : undefined//no trigger
            )
          )
        )
      )
    )(IO((self: IO) => Array(ios.length).fill(0)));

export { allThenResetIO };
