const getUniqSymbol = (arr) => arr.filter((item, i) => arr.indexOf(item) === i);
const findDuplicates = (arr) =>
  arr.filter((item, i) => arr.indexOf(item) !== i);

const maxItemAssociation = (shoppingArray) => {
  if (shoppingArray.length === 0) {
    return;
  }

  let result = [];
  const expandedArray = shoppingArray.flat();
  const desiredSymbols = getUniqSymbol(findDuplicates(expandedArray));

  desiredSymbols.forEach((uniqItem) => {
    shoppingArray.forEach((item) => {
      if (item.includes(uniqItem)) {
        result.push(item);
      }
    });
  });

  if (getUniqSymbol(result.flat()).length % 2 === 0) {
    result = getUniqSymbol(result.flat())
      .sort()
      .slice(0, getUniqSymbol(result.flat()).length / 2);
  }

  result = getUniqSymbol(result.flat()).sort();

  // eslint-disable-next-line consistent-return
  return result;
};

export default maxItemAssociation;
