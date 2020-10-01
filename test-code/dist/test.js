import { IO, next } from "../../code/dist/io-next.js";
import { allThenResetIO } from "../../code/dist/allThenResetIO.js";
const right = a => b => b;
const log = msg => right(console.log(msg))(msg);
const customOperator = op => f => set => Object.defineProperty(set, op, {
    value: function (a) {
        return f(a)(this);
    }
}); //returns new set/object
{
    {
        const a = IO(99);
        a['>>'](console.log);
        console.log("code finished");
    }
    const a = IO(undefined);
    const b = a['>>']((a) => a * 2);
    next(3)(a);
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
        next([1, 5])(expectedIO);
        next(9)(ioA);
        next(1)(ioA);
        next(5)(ioB);
        //filled and cleared
    }
    {
        next([9, 2])(expectedIO);
        next(7)(ioA);
        {
            next(9)(ioA);
            next(2)(ioB);
        } //filled and cleared
    }
    {
        next([3, 9])(expectedIO);
        next(1)(ioA);
        {
            next(undefined)(ioA);
            {
                next(9)(ioB);
                next(3)(ioA);
            } //filled and cleared
        }
    }
}
log("============================");
const A = IO(undefined);
const B = A['>>'](a => a * 2)['>>'](log);
const C = A['>>'](log);
next(5)(next(3)(A));
customOperator('.')(g => f => x => g(f(x)))(Function.prototype);
customOperator('..')(g => f => x => IO(x)['>>'](f)['>>'](g))(Function.prototype);
{
    log("============================");
    log("==monad laws================");
    log("============================");
    {
        log("associativity------");
        const f1 = a => a * 2;
        const f2 = a => a + 1;
        {
            IO(1)['>>'](f1)['>>'](f2)['>>'](log);
        }
        { //endofunctor
            IO(1)['>>'](x => f2(f1(x)))['>>'](log);
            IO(1)['>>']((f1)['.'](f2))['>>'](log);
        }
        {
            IO(1)['>>'](x => IO(x)['>>'](f1)['>>'](f2))['>>'](log);
            IO(1)['>>']((f1)['..'](f2))['>>'](log);
        }
        { //composition is point free
            log(//composition is point free
            "monad composition");
            const io1 = IO['..'](f1)['..'](f2)['..'](log);
            io1(1);
            const io2 = (f1)['..'](f2)['..'](log);
            io2(1);
            const io3 = (f1)['..'](f2)['..'](log)['..'](IO);
            io3(1);
        }
    }
    {
        log("associativity Monad Function------");
        const f1 = a => IO(a * 2);
        const f2 = a => IO(a + 1);
        {
            IO(1)['>>'](f1)['>>'](f2)['>>'](log);
        }
        {
            IO(1)['>>'](x => IO(x)['>>'](f1)['>>'](f2))['>>'](log);
            IO(1)['>>']((f1)['..'](f2))['>>'](log);
        }
    }
    {
        log("associativity Monad Function Monad value------");
        const f1 = a => a['>>'](a => IO(IO(a * 2)));
        const f2 = a => a['>>'](a => IO(IO(a + 1)));
        const a = IO(1);
        {
            IO(a)['>>'](f1)['>>'](f2)['>>'](log)['>>'](log);
        }
        {
            IO(a)['>>'](x => IO(x)['>>'](f1)['>>'](f2))['>>'](log)['>>'](log);
            IO(a)['>>']((f1)['..'](f2))['>>'](log)['>>'](log);
        }
    }
    {
        log("idientiry left-right-- m * f ----");
        const f = a => IO(a * 2);
        //left  e * f = f
        const left = (IO)['..'](f)(1);
        //center  f
        const center = f(1);
        //right  m * e = m
        const right = (f)['..'](IO)(1);
        left['>>'](log);
        center['>>'](log);
        right['>>'](log);
    }
}
{
    log("equations ------");
    const a = IO(1);
    const b = a['>>'](a => a * 2);
    const c = a['>>'](a => b['>>'](b => a + b));
    const aLog = a['>>'](log);
    const bLog = b['>>'](log);
    const cLog = c['>>'](log);
    next(10)(a);
    next(100)(a);
}
