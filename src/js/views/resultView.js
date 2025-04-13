import View from "./Views.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";
class ResultView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "We Couldn't find that recipe. Please Try another one! ";
  // _message = "";

  _generateMarkUp() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultView();
/**/
