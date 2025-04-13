import "core-js/es/array";

import icons from "url:../../img/icons.svg";
export default class View {
  _data;

  render(data, render = true) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();
    const markUp = this._generateMarkUp();
    if (!render) return markUp;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
  update(data) {
    this._data = data;

    const newMarkUp = this._generateMarkUp();
    ///Create A virtual DOM which Will live in the memory
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    //which will Give us the node list
    const newElement = Array.from(newDOM.querySelectorAll("*"));
    const currElement = Array.from(this._parentElement.querySelectorAll("*"));
    // console.log(newElement);
    newElement.forEach((newEl, i) => {
      const curEl = currElement[i];
      ////This Logic is onliy working for the text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      ////Logic For updateing the DataAttribute
      if (!curEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }
  renderSpiner = function () {
    const markUp = `<div class="spinner">
              <svg>
                <use href="${icons}.svg#icon-loader"></use>
              </svg>
            </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  };
  renderError(message = this._errorMessage) {
    const markUp = `<div class="error">
              <div>
                <svg>
                  <use href="${icons}.svg#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
  renderMessage(message = this._message) {
    const markUp = `<div class="message">
              <div>
                <svg>
                  <use href="${icons}.svg#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
}
