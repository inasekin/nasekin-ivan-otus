function getPath(node) {
  if (!(node instanceof Element)) return;

  const path = [];

  // Проходимся по элементам родительской цепочки
  while (node.parentElement) {
    let selector = node.tagName.toLowerCase();

    if (node.id) {
      // Если есть ID, используем его как часть селектора
      selector += `#${node.id}`;
      path.unshift(selector);
      break;
    } else {
      // Иначе ищем классы
      const classes = Array.from(node.classList);
      const classSelector = classes.length > 0 ? `.${classes.join('.')}` : '';
      selector += classSelector;

      // Поиск индекса элемента среди своих соседей
      const siblings = Array.from(node.parentElement.children);
      const index = siblings.indexOf(node) + 1;
      selector += `:nth-child(${index})`;

      path.unshift(selector);
      // eslint-disable-next-line no-param-reassign
      node = node.parentElement;
    }
  }

  // eslint-disable-next-line consistent-return
  return path.join(' > ');
}

module.exports = { getPath };
