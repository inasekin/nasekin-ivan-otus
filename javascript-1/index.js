/* eslint-disable no-console */
import maxItemAssociation from './maxItemAssociation.js';
import sum from './sum.js';

console.log(
  maxItemAssociation([
    ['a', 'b'],
    ['a', 'c'],
    ['d', 'e'],
  ])
);
console.log(
  maxItemAssociation([
    ['q', 'w', 'a'],
    ['a', 'b'],
    ['a', 'c'],
    ['q', 'e'],
    ['q', 'r'],
  ])
);

console.log(sum(1)(2)(3)(4)()); // 10
const a = sum(4)(3);
console.log(a); // function
const b = a(1)(2)(5);
console.log(b); // function
const c = b();
console.log(c); // 15
