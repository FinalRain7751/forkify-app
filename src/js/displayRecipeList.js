import { BASE_URL } from "./index";
import { getRecipes } from "./getData";
import displayRecipe from "./displayRecipe";

const recipeListDiv = document.querySelector("#recipeList");
const spinner = document.querySelector(".recipe-list  .spinner");

export const displayRecipeList = async (event) => {
  event.preventDefault();
  spinner.classList.remove("hidden");

  const formData = new FormData(event.target);

  const searchTerm = formData.get("search");

  const recipes = await getRecipes(BASE_URL, searchTerm);

  const htmlToInsert = recipes
    .map((recipe) => {
      return `<li data-id=${recipe.id} class="recipe-list--item">
    <img src="${recipe.image_url}" alt="small recipe image" />
    <div>
      <h4>${recipe.title}</h4>
      <p>${recipe.publisher}</p>
    </div>
  </li>`;
    })
    .join("");

  spinner.classList.add("hidden");
  recipeListDiv.insertAdjacentHTML("afterbegin", htmlToInsert);

  const recipeListItems = document.querySelectorAll(".recipe-list--item");

  recipeListItems.forEach((item) => {
    item.addEventListener("click", displayRecipe);
  });
};
