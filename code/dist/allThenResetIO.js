import { IO, next } from "./io-next.js";
const right = (a) => (b) => b;
const third = (a) => (b) => (c) => c;
const replace = (arr) => (index) => (val) => [...arr.slice(0, index), val,
    ...arr.slice(index + 1)];
const mm = (A) => (B) => A.map((a, index) => a * B[index]);
const allThenResetIO = (ios) => ((newIO) => ((flagIO) => third(ios.map((io, index) => io['>>'](() => ((uMask) => (target) => next(mm(uMask)(target))(flagIO))(ios.map(io => io.lastVal === undefined ? 0 : 1))(replace(flagIO.lastVal)(index)(1)))))(flagIO['>>']((flags) => next(//all  updated?
(flags.reduce((a, b) => (a * b))
    === 1)
    ? right //clear flag
    (next(Array(ios.length).fill(0))(flagIO))(ios.map((io) => io.lastVal)) //trigger!!
    : undefined //no trigger
)(newIO)))(newIO))(IO(Array(ios.length).fill(0))) //flagIO
)(IO(undefined)); //new IO
export { allThenResetIO };
