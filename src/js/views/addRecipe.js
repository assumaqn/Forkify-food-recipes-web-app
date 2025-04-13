import View from "./Views.js";
import icons from "url:../../img/icons.svg";
class addRecipe extends View {
  ///Taking the form as the parent element
  _message = "Recipe was Successfully Uploaded :)";
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  btnOpen = document.querySelector(".nav__btn--add-recipe");
  btnClose = document.querySelector(".btn--close-modal");
  btnUpload = document.querySelector(".upload__btn");

  constructor() {
    super();
    this._addHandlerOpen();
    this._addHandlerHide();
  }
  toggle() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }
  _addHandlerOpen() {
    this.btnOpen.addEventListener("click", this.toggle.bind(this));
  }
  _addHandlerHide() {
    this.btnClose.addEventListener("click", this.toggle.bind(this));
    this._overlay.addEventListener("click", this.toggle.bind(this));
  }
  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const dataArr = [...new FormData(this)];
        ////changing the array to object b/c uploading to API work on object
        const data = Object.fromEntries(dataArr);
        handler(data);
      }

      // _errorMessage = "";
    );
  }
}

export default new addRecipe();
/**/
