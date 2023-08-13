/**
 * @jest-environment jsdom
 */

const { getPath } = require('./getPath');

document.body.innerHTML = `<body><div class="test"><ul><li class="test-item">Item 1</li><li class="test-item">Item 2</li><li class="test-item">Item 3</li></ul></div></body>`;

const node = document.querySelectorAll('li.test-item')[1];

describe('getPath', () => {
  test('must be a String', () => {
    expect(typeof getPath(node)).toBe('string');
  });

  test('not empty string', () => {
    expect(getPath(node).length).not.toBe(0);
  });

  test('only one node', () => {
    const selector = getPath(node);

    expect(document.querySelectorAll(selector).length).toBe(1);
  });

  test('is same node', () => {
    const selector = getPath(node);

    expect(document.querySelector(selector)).toBe(node);
  });
});
