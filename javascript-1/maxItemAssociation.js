const makeUniq = (arr) => {
  const uniqSet = new Set(arr);
  return [...uniqSet];
};

const maxItemAssociation = (shoppingArray) => {
  if (shoppingArray.length === 0) {
    return;
  }

  const result = [];
  const expandedArray = shoppingArray.flat();

  const occurrenceObject = {};

  for (let i = 0; i < expandedArray.length; i += 1) {
    const elem = expandedArray[i];
    if (occurrenceObject[elem] === undefined) {
      occurrenceObject[elem] = 1;
    } else {
      occurrenceObject[elem] += 1;
    }
  }

  const occurrenceObjectValues = Object.values(occurrenceObject);
  const occurrenceObjectKeys = Object.keys(occurrenceObject);

  for (let i = 0; i < occurrenceObjectValues.length; i += 1) {
    if (occurrenceObjectValues[i] > 1) {
      const desiredSymbol = occurrenceObjectKeys[i];

      for (let j = 0; j < shoppingArray.length; j += 1) {
        if (
          shoppingArray[j].findIndex((element) => element === desiredSymbol) !==
          -1
        ) {
          result.push(shoppingArray[j]);
        }
      }
    }
  }

  // eslint-disable-next-line consistent-return
  return makeUniq(result.flat().sort());
};

export default maxItemAssociation;
