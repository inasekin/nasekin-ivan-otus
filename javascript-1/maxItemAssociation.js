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

  const occurrenceObject = expandedArray.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {}
  );
  const occurrenceObjectValues = Object.values(occurrenceObject);
  const occurrenceObjectKeys = Object.keys(occurrenceObject);

  for (let i = 0; i < occurrenceObjectValues.length; i++) {
    if (occurrenceObjectValues[i] > 1) {
      const desiredSymbol = occurrenceObjectKeys[i];

      for (let j = 0; j < shoppingArray.length; j++) {
        if (
          shoppingArray[j].findIndex((element) => element === desiredSymbol) !==
          -1
        ) {
          result.push(shoppingArray[j]);
        }
      }
    }
  }

  return makeUniq(result.flat().sort());
};

export default maxItemAssociation;
