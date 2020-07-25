import { IO } from "../code/dist/io-next.js";
import { allThenResetIO } from "../code/dist/allThenResetIO.js";
const True = (done) => () => {
    done();
    return true;
};
//  multiple values on the io
{
    const io = IO();
    test("io.next = 1 -> 2 -> 3;", (done) => {
        //--------------------------
        io['->']((a) => expect(a)
            .toBe(io.now) //1 -> 2 -> 3
        );
        //--------------------------
        //async test helper
        io['->'](True(done));
    });
    io.next = 1; //trigger
    io.next = 2; //trigger
    io.next = 3; //trigger
}
{
    const io = IO();
    io.next = 1;
    io.next = 2;
    io.next = 3; //trigger
    test("io.next = 3;", (done) => {
        //--------------------------
        io['->']((a) => expect(a)
            .toBe(3));
        //--------------------------
        //async test helper
        io['->'](True(done));
    });
}
