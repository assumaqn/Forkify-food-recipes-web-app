import View from "./Views.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";
class BookMarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmark yet. Find a nice recipe and bookmark it :)";
  // _message = "";
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkUp() {
    return this._data
      .map((bookMark) => previewView.render(bookMark, false))
      .join("");
  }
}

export default new BookMarkView();
/**/
