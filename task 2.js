const EventEmitter = require('events');

const pipe = (...fns) => {
    for (const fn of fns) {
        if (typeof fn !== 'function') {
            throw new TypeError('All arguments must be functions');
        }
    }
    const emitter = new EventEmitter();
    const composedFunction = (x) => {
        return fns.reduce((acc, fn) => {
            try {
                return fn(acc);
            } catch (error) {
                emitter.emit('error', error);
                return undefined;
            }
        }, x);
    };
    composedFunction.on = (event, listener) => emitter.on(event, listener);

    return composedFunction;
};

const inc = x => ++x;
const twice = x => x * 2;
const cube = x => x ** 3;

try {
    const f = pipe(inc, twice, cube);
    f.on('error', e => console.error('Chain error:', e.message));
    console.log(f(5));
} catch (error) {
    console.error(error.message);
}

try {
    const f2 = pipe(inc, inc);
    f2.on('error', e => console.error('Chain error:', e.message));
    console.log(f2(7));
} catch (error) {
    console.error(error.message);
}

try {
    const f3 = pipe(inc, x => { throw new Error('Function error'); }, cube);
    f3.on('error', e => console.error('Chain error:', e.message));
    console.log(f3(5));
} catch (error) {
    console.error(error.message);
}

try {
    const f4 = pipe(inc, 7, cube);
} catch (error) {
    console.error(error.message);
}
