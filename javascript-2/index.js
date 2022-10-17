/* eslint-disable no-console */
// eslint-disable-next-line import/extensions
import promiseReduce from './promiseReduce.js';

const fn1 = () => {
  console.log('fn1');
  return Promise.resolve(1);
};
const fn2 = () =>
  new Promise((resolve) => {
    console.log('fn2');
    setTimeout(() => resolve(2), 1000);
  });

promiseReduce(
  [fn1, fn2],
  (memo, value) => {
    console.log('reduce');
    return memo * value;
  },
  1
).then(console.log);
