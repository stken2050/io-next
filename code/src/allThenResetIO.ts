import { IO, next } from "./io-next.js";

const right = <T>(a: T) => <U>(b: U) => b;
const third = <T>(a: T) => <U>(b: U) => <V>(c: V) => c;

const replace = (arr: number[]) =>
  (index: number) =>
    (val: number) =>
      [...arr.slice(0, index), val,
      ...arr.slice(index + 1)];

const mm = (A: number[]) => (B: number[]) =>
  A.map((a, index) => a * B[index]);

const allThenResetIO =
  (ios: IO[]): IO =>

    ((newIO: IO) =>
      ((flagIO: IO) =>
        third
          (
            ios.map((io, index) =>
              io['>>'](() =>
                ((uMask: number[]) =>
                  (target: number[]) =>
                    flagIO |> next(mm(uMask)(target)))
                  (ios.map(io =>
                    io.lastVal === undefined ? 0 : 1))
                  (replace(flagIO.lastVal as number[])(index)(1))
              )
            )
          )
          (
            flagIO['>>'](
              (flags: number[]) =>
                newIO |> next(  //all  updated?
                  (flags.reduce((a: number, b: number) => (a * b))
                    === 1)
                    ? right//clear flag
                      (flagIO |> next(Array(ios.length).fill(0)))
                      (ios.map((io) => io.lastVal))//trigger!!
                    : undefined//no trigger
                )
            )
          )
          (newIO)

      )(IO(Array(ios.length).fill(0)))//flagIO
    )(IO(undefined)) //new IO


export { allThenResetIO };
