import { IO } from "../code/dist/io-next.js";
import { allThenResetIO } from "../code/dist/allThenResetIO.js";
const True = (done) => () => {
    done();
    return true;
};
test("ioAB = allThenResetIO" +
    "([ioA, ioB])", (done) => {
        //--------------------------
        const ioA = IO();
        const ioB = ioA
        ['->']((a) => a * 2);
        const ioAB = allThenResetIO(
            [ioA, ioB]);
        ioAB
        ['->']((arr) => expect(arr).toEqual([1, 2]));
        ioA.next = 1;
        //--------------------------
        //async test helper
        ioAB['->'](True(done));
    });
test("ioAB = allThenResetIO" +
    "([ioA, ioB]) multi", (done) => {
        //--------------------------
        const ioA = IO();
        const ioB = IO();
        const ioAB = allThenResetIO([ioA, ioB]);
        ioAB
        ['->']((arr) => expect(arr).toEqual(expectedIO.now));

        const expectedIO = IO();

        {
            expectedIO.next = [1, 5];
            ioA.next = 9;
            ioA.next = 1;
            ioB.next = 5;
            //filled and cleared
        }
        {
            expectedIO.next = [9, 2];
            ioA.next = 7;
            {
                ioA.next = 9;
                ioB.next = 2;
            } //filled and cleared
        }
        {
            expectedIO.next = [3, 9];
            ioA.next = 1;
            {
                ioA.next = undefined;
                {
                    ioB.next = 9;
                    ioA.next = 3;
                } //filled and cleared
            }
        }
        //--------------------------
        //async test helper
        ioAB['->'](True(done));
    });
