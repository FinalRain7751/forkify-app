"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";

import {
  getSearchResultsPerPage,
  loadRecipe,
  loadRecipesList,
  state,
} from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import recipeListView from "./views/recipeListView";
import paginationBtnView from "./views/paginationBtnView";

if (module.hot) {
  module.hot.accept();
}

export const controlRecipes = async () => {
  try {
    recipeView.renderSpinner();
    await loadRecipe(recipeView.getRecipeId());
    recipeView.render(state.recipe);
  } catch (err) {
    console.log(`${err} 🌋🌋🌋`);
    recipeView.renderError();
  }
};

export const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery().trim();
    if (!query) return;

    recipeListView.renderSpinner();
    await loadRecipesList(query);

    recipeListView.render(getSearchResultsPerPage());
    paginationBtnView.render({
      lastPage: state.search.lastPage,
      currentPage: state.search.page,
    });
  } catch (err) {
    console.log(`${err} 🌋🌋🌋`);
    recipeListView.renderError();
  }
};

export const controlPagination = () => {
  state.search.page = paginationBtnView.getTargetPage();

  // if (event === "next") {
  //   state.search.page += 1;
  // } else {
  //   state.search.page -= 1;
  // }

  recipeListView.render(getSearchResultsPerPage());
  paginationBtnView.render({
    lastPage: state.search.lastPage,
    currentPage: state.search.page,
  });
};

const init = () => {
  searchView.searchBarAnimation();
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationBtnView.addHandlerPagination(controlPagination);
};

init();
