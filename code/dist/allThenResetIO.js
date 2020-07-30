import { IO } from "./io-next.js";
const left = (a) => (b) => a;
const right = (a) => (b) => b;
const replace = (arr) => (index) => (val) => [...arr.slice(0, index), val,
    ...arr.slice(index + 1)];
const mm = (A) => (B) => A.map((a, index) => a * B[index]);
const allThenResetIO = (ios) => ((flagIO) => IO((self) => left(undefined)(right(ios.map((io, index) => io['->'](() => ((uMask) => (target) => flagIO.next = mm(uMask)(target))(ios.map(io => io.now === undefined ? 0 : 1))(replace(flagIO.now)(index)(1)))))(flagIO['->']((flags) => self.next = //all  updated?
    (flags.reduce((a, b) => (a * b))
        === 1)
        ? left(ios.map((io) => io.now))(flagIO.next = Array(ios.length).fill(0))
        : undefined //no trigger
)))))(IO((self) => Array(ios.length).fill(0)));
export { allThenResetIO };
