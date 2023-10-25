// eslint-disable-next-line max-classes-per-file
class MyTree extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = JSON.parse(this.getAttribute('items'));
    let content = '';
    if (data && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        if (item.items && item.items.length > 0) {
          content += `<my-tree id="${item.id}" items='${JSON.stringify(
            item.items
          )}'></my-tree>`;
        } else {
          content += `<my-leaf id="${item.id}"></my-leaf>`;
        }
      }
    }
    this.shadowRoot.innerHTML = `
            <div>ID: ${this.getAttribute('id')}</div>
            ${content}
        `;
  }
}

class MyLeaf extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `<div>ID: ${this.getAttribute('id')}</div>`;
  }
}

customElements.define('my-tree', MyTree);
customElements.define('my-leaf', MyLeaf);
