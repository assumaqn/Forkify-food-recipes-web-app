import View from "./Views.js";
import icons from "url:../../img/icons.svg";
class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  //To Implement this we will need the entire search result
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      // console.log(btn);
      // console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkUp() {
    const curPage = this._data.page;
    const numbPage = Math.ceil(
      this._data.result.length / this._data.resultPages
    );
    const nextPage = `<button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    const previousPage = `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    //page 1 and there are other page
    if (curPage == 1 && numbPage > 1) {
      return nextPage;
    }
    //we are in other page
    if (curPage < numbPage) {
      return nextPage + previousPage;
    }
    //we are in the last page
    if (curPage == numbPage && numbPage > 1) {
      return previousPage;
    }
    return "only 1 page ";
    ///page 1 and there are no other page
  }
}
export default new PaginationView();
