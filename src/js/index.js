"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";

import displayRecipe from "./displayRecipe";
import { displayRecipeList } from "./displayRecipeList";

const searchBtn = document.querySelector(".btn--search");
const seachInput = document.querySelector(".nav-form--input");
const searchForm = document.querySelector(".nav-form");

searchForm.addEventListener("submit", displayRecipeList);

export const BASE_URL = "https://forkify-api.herokuapp.com/api/v2/recipes/";

// Search Button and input animation
seachInput.addEventListener("focus", (e) => {
  e.preventDefault();

  searchBtn.classList.add("btn--search-translateY");
});

seachInput.addEventListener("blur", (e) => {
  e.preventDefault();

  searchBtn.classList.remove("btn--search-translateY");
});

// Rendering a selected recipe
// displayRecipe().then();
