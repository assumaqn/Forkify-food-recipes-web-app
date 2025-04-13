// import { search } from "core-js/fn/symbol";
import "core-js/es/symbol/search";

import { API_URL, searchResults, KEY } from "./config.js";
import { AJAX } from "./Helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "", ///We Might need in the future which query is most searched
    result: [],
    resultPages: searchResults,
    page: 1,
  },
  bookMark: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ///Create the API key if it exist using the and short cercuting
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookMark.some((bookMark) => bookMark.id === id)) {
      state.recipe.bookMarked = true;
    } else {
      state.recipe.bookMarked = false;
    }
  } catch (err) {
    console.error(`${err}💥💥🤯🤯`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.result = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    ////This will reset the page when ever we search for new result
    state.search.page = 1;
    // console.log(data);
  } catch (err) {
    console.log(err);
    ///rethrow the error so that it would be catch by the controller
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPages;
  const end = page * state.search.resultPages;

  return state.search.result.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

const persistBookMark = function () {
  ///this function allow us to set our bookmark to A local storage
  ///by converting it to string
  localStorage.setItem("bookmark", JSON.stringify(state.bookMark));
};

export const addBookMark = function (recipe) {
  state.bookMark.push(recipe);

  ////Marking the current element as Bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookMark();
};

export const deleteBookMark = function (id) {
  const index = state.bookMark.findIndex((el) => el.id == id);
  state.bookMark.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookMark();
};

////creating an init function which will be called when ever the page is loaded

const init = function () {
  const storage = localStorage.getItem("bookmark");
  if (storage) state.bookMark = JSON.parse(storage);
};
init();
const clearLocal = function () {
  localStorage.clear("bookmark");
};
// clearLocal();

///Uploading A recipe to an API

export const uploadRecipe = async function (newRecipe) {
  try {
    /// ingredient Which would allow us convert te object that we get to an arra
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient Format Please use the correct format:)"
          );
        const [quantity, unit, description] = ingArr;
        ////make the quantity a number and if it doesn't have any set it to null
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    ///this is the data which is ready to be appload to the API
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    ///because this request will also send the data back to us
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
    // console.log(data);
  } catch (err) {
    throw err;
  }
};
