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

export const controlRecipes = async (recipeId) => {
  try {
    recipeView.renderSpinner();
    await loadRecipe(recipeId);
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

export const controlBookmarks = async (action = "") => {
  if (action) {
    updateBookmarks(action);
    recipeView.render(state.recipe);
  }

  await loadBookmarks();
  const bookmarkedRecipes = state.bookmarks.recipes;
  if (bookmarkedRecipes.length === 0) return;

  bookmarkView.render(bookmarkedRecipes);
};

export const controlServings = (action) => {
  const currServings = state.recipe.servings;
  const currIngredients = state.recipe.ingredients;

  if (action === "increase") {
    state.recipe.servings = currServings + 1;
  } else {
    if (currServings === 1) return;
    state.recipe.servings -= 1;
  }

  state.recipe.ingredients = currIngredients.map((ing) => {
    const quantity = (ing.quantity / currServings) * state.recipe.servings;
    return {
      ...ing,
      quantity: quantity === 0 ? null : quantity,
    };
  });

  recipeView.render(state.recipe);
};

const init = () => {
  searchView.searchBarAnimation();
  bookmarkView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(
    controlRecipes,
    controlServings,
    controlBookmarks
  );
  searchView.addHandlerSearch(controlSearchResults);
  paginationBtnView.addHandlerPagination(controlPagination);
};

init();
