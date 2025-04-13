import * as model from "../js/model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/SearchView.js";
import ResultView from "./views/resultView.js";
import BookMarkView from "./views/bookMarkView.js";
import PaginationView from "./views/PaginationView.js";
import { SET_TIME_CLOSE } from "./config.js";
import "core-js/stable";
import icons from "url:../img/icons.svg";
import "regenerator-runtime/runtime";
import bookMarkView from "./views/bookMarkView.js";
import addRecipe from "./views/addRecipe.js";

//import icons from "../img/icons.svg";parcel

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// console.log("Testing the call");

////Creating the load spiner

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    ///0 Marking the Selected result

    //1) Load the Recipe

    recipeView.renderSpiner();
    ResultView.update(model.getSearchResultsPage());
    BookMarkView.update(model.state.bookMark);

    //2) Render
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    // controlServing();
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    ResultView.renderSpiner();

    await model.loadSearchResult(query);
    ////Render result

    ResultView.render(model.getSearchResultsPage());
    ////Render Initial pagination
    PaginationView.render(model.state.search);
    // ResultView.render(model.state.search.result);//rendering the Whole data
  } catch (err) {
    console.error(err.message);
  }
};
const controlPagination = function (goToPage = 1) {
  ResultView.render(model.getSearchResultsPage(goToPage));
  PaginationView.render(model.state.search);
};
const controlServing = function (newServing) {
  model.updateServing(newServing);
  recipeView.update(model.state.recipe);
};
const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  BookMarkView.render(model.state.bookMark);
};
const controlBookMark = function () {
  bookMarkView.render(model.state.bookMark);
};

const contrlUpload = async function (newRecipe) {
  try {
    addRecipe.renderSpiner();
    await model.uploadRecipe(newRecipe);

    ///rendering the Upload data to the UI
    addRecipe.renderMessage();
    setTimeout(function () {
      addRecipe.toggle();
    }, SET_TIME_CLOSE * 1000);
    ///changing the URL when we add new recipe
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    ///re-rendering the bookmarks
    bookMarkView.render(model.state.bookMark);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);

    addRecipe.renderError(err.message);
  }
  // console.log(newRecipe);
};
// controlSearchResult();
const init = function () {
  bookMarkView.addHandlerRender(controlBookMark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdate(controlServing);
  addRecipe.addHandlerUploadRecipe(contrlUpload);
  recipeView.addHandlerBookMarked(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResult);
  PaginationView.addHandlerClick(controlPagination);
};
init();

// controlRecipes();

///The old way of Doing Which does not follow the Dry principle
// window.addEventListener("hashchange", controlRecipes);
// window.addEventListener("load", controlRecipes);
