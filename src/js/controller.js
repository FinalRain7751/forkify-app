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
  updateServings,
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

export const controlBookmarks = async () => {
  try {
    await loadBookmarks();
    const bookmarkedRecipes = state.bookmarks.recipes;
    if (bookmarkedRecipes.length === 0) return;

    bookmarkView.render(bookmarkedRecipes);
  } catch (err) {
    console.log(`${err} 🌋🌋🌋`);
    bookmarkView.renderError();
  }
};

export const controlUpdateBookmarks = (action) => {
  const currBookmarksIds = state.bookmarks.recipeIds;
  const currBookmarks = state.bookmarks.recipes;

  let newBookmarksIds = [...currBookmarksIds];
  let newBookmarks = [...currBookmarks];

  const recipeId = state.recipe.id;
  if (action === "add") {
    newBookmarksIds.push(recipeId);
    newBookmarks.push(state.recipe);
  } else {
    newBookmarksIds = currBookmarksIds.filter((id) => id !== recipeId);
    newBookmarks = currBookmarks.filter((bm) => bm.id !== recipeId);
  }

  updateBookmarks(newBookmarksIds, newBookmarks);
  recipeView.update(state.recipe);

  // if (newBookmarks.length === 0) {
  //   bookmarkView._clear;
  // }

  // bookmarkView.render(state.bookmarks.recipes);
  bookmarkView.render(state.bookmarks.recipes);
};

export const controlServings = (action) => {
  const currServings = state.recipe.servings;

  let newServings;
  if (action === "increase") {
    newServings = currServings + 1;
  } else {
    if (currServings === 1) return;
    newServings = currServings - 1;
  }

  updateServings(newServings);

  // recipeView.render(state.recipe);
  recipeView.update(state.recipe);
};

const init = () => {
  searchView.searchBarAnimation();
  bookmarkView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBookmarks(controlUpdateBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationBtnView.addHandlerPagination(controlPagination);
};

init();
