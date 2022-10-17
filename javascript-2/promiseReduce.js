const promiseReduce = async (asyncFunctions, reduce, initialValue) => {
  if (asyncFunctions.length === 0) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('Empty array of functions');
  }

  let result = initialValue;

  // eslint-disable-next-line no-restricted-syntax
  for (const func of asyncFunctions) {
    // eslint-disable-next-line no-await-in-loop
    result = reduce(result, await func());
  }

  return Promise.resolve(result);
};

export default promiseReduce;
