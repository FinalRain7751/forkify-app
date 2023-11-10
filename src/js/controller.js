"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";

import {
  getSearchResultsPerPage,
  loadBookmarks,
  updateBookmarks,
  loadRecipe,
  loadRecipesList,
  state,
} from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import recipeListView from "./views/recipeListView";
import paginationBtnView from "./views/paginationBtnView";
import bookmarkView from "./views/bookmarkView";

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

  recipeListView.render(getSearchResultsPerPage());
  paginationBtnView.render({
    lastPage: state.search.lastPage,
    currentPage: state.search.page,
  });
};

export const controlBookmarks = () => {
  const bookmarkedRecipes = state.bookmarks.recipes;
  if (bookmarkedRecipes.length === 0) return;

  bookmarkView.render(bookmarkedRecipes);
};

export const controlBookmarkStatus = () => {
  const recipeId = recipeView.getRecipeId();

  return state.bookmarks.recipeIds.find((id) => id === recipeId) ? true : false;
};

const init = () => {
  searchView.searchBarAnimation();
  bookmarkView.addHandlerBookmarks(loadBookmarks, controlBookmarks);
  recipeView.addHandlerRender(
    controlRecipes,
    controlBookmarkStatus,
    updateBookmarks
  );
  searchView.addHandlerSearch(controlSearchResults);
  paginationBtnView.addHandlerPagination(controlPagination);
};

init();
