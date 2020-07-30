import { IO } from "./code/dist/io-next.js";
import { allThenResetIO } from "./code/dist/allThenResetIO.js";

{
  const a = IO(self => 99);
  a['->'](console.log);

  console.log("code finished");
  /*

  IO.a = IO();
  IO.b = IO.a['->']((a) => a * 2);
  IO.log = IO((self) => righIO(self['->'](console.log))(undefined));
  IO.a.next = 3;
  IO.dummy0 = IO.b['->']((b) => IO.log.next = b);
  IO.a.next = 99;
  */
}
{
  const left = (a) => (b) => a;
  const right = (a) => (b) => b;

  const timer = IO();
  const start = IO();

  const dummy1 = start['->'](
    (msg) =>
      left
        (timer.next = msg)
        (setInterval(() =>
          timer.next = "ping", 1000))
  );

  const dummy = timer['->'](console.log);
  start.next = "start";
}


/*
const log = msg => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

{

  const a = IO();
  a['->'](log)['->'](log);


}
{

  const a = IO(self => 1)//['->'](a => a * 2);
  //const b = a['->'](a => a * 2);


  a['->'](a => log("a:" + a))
  a['->'](log)['->'](log);


  a.next = undefined;
  a.next = 7;

  a.next = undefined;

}
//console.log(a.now);
//console.log(b.now);
//b['->'](console.log);

*/