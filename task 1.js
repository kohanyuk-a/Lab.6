const pipe = (...fns) => {
    for (const fn of fns) {
        if (typeof fn !== 'function') {
            throw new TypeError('All arguments must be functions');
        }
    }
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
};

const inc = x => ++x;
const twice = x => x * 2;
const cube = x => x ** 3;

try {
    const f = pipe(inc, twice, cube);
    console.log(f(5));
} catch (error) {
    console.error(error.message);
}

try {
    const f2 = pipe(inc, inc);
    console.log(f2(7));
} catch (error) {
    console.error(error.message);
}

try {
    const f3 = pipe(inc, 7, cube);
} catch (error) {
    console.error(error.message);
}
