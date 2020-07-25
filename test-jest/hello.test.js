import { IO } from "../code/dist/io-next.js";
import { allThenResetIO } from "../code/dist/allThenResetIO.js";

const True = (done) => () => {
    done();
    return true;
};

test("io.next === 1", () => {
    //--------------------------
    const io = IO();
    io.next = 1;
    expect(io.now)
        .toBe(1);
    //--------------------------
});

test("IO(self => 1) === 1", () => {
    //--------------------------
    const io = IO(self => 1);
    expect(io.now)
        .toBe(1);
    //--------------------------
});

test("IO(self => 1)['->'](a => a * 2) === 2", () => {
    //--------------------------
    const io = IO(self => 1)['->'](a => a * 2);
    expect(io.now)
        .toBe(2);
    //--------------------------
});

test("io['->']();", (done) => {
    //--------------------------
    const io = IO();
    io['->']((a) => done.fail());
    //--------------------------
    // when io.now is undefined, never triggered
    setTimeout(done, 100);
});
test("io['->'](); io.next = undefined;", (done) => {
    //--------------------------
    const io = IO();
    io['->']((a) => done.fail());
    io.next = undefined;
    //--------------------------
    // when io.now is undefined, never triggered
    setTimeout(done, 100);
});
test("io.next = 1;io['->']();", (done) => {
    //--------------------------
    const io = IO();
    io.next = 1; //before sync;
    io['->']((a) => expect(a).toBe(1));
    //--------------------------
    //async test helper
    io['->'](True(done));
});
test("io['->']();io.next = 1;", (done) => {
    //--------------------------
    const io = IO();
    io['->']((a) => expect(a).toBe(1));
    {
        io.next = 1; //after sync;
    }
    //--------------------------
    //async test helper
    io['->'](True(done));
});
test("io['->']();io.next = 1, !== 9;", (done) => {
    //--------------------------
    const io = IO();
    io['->']((a) => expect(a).not.toBe(9));
    {
        io.next = 1; //after sync;
    }
    //--------------------------
    //async test helper
    io['->'](True(done));
});

test("ioB = ioA['->'](a => a * 2);", (done) => {
    //--------------------------
    const ioA = IO();
    const ioB = ioA['->']((a) => (a * 2));
    {
        ioA.next = 1;
        expect(ioB.now)
            .toBe(2); //1*2
    }
    //--------------------------
    //async test helper
    ioB['->'](True(done));
});
test("ioB = ioA['->'](a => a *2 )" +
    "['->'](a=>a+1);", (done) => {
        //--------------------------
        const ioA = IO();
        const ioB = ioA
        ['->']((a) => (a * 2))
        ['->']((a) => (a + 1));
        {
            ioA.next = 1;
            expect(ioB.now)
                .toBe(3); //1*2+1
        }
        //--------------------------
        //async test helper
        ioB['->'](True(done));
    });