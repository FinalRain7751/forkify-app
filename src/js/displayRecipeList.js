import { BASE_URL } from "./index";
import paginate from "./paginate";
import { getRecipes } from "./getData";
import displayRecipe from "./displayRecipe";
import icons from "url:../images/icons.svg";

const recipeListContainer = document.querySelector("#recipeList");
const spinner = document.querySelector(".recipe-list  .spinner");
const btnContainer = document.querySelector(".pagination-actions");

export const displayRecipeList = async (searchTerm, currentPage = 1) => {
  recipeListContainer.innerHTML = "";
  btnContainer.innerHTML = "";
  spinner.classList.remove("hidden");

  btnContainer.dataset.search = searchTerm;
  btnContainer.dataset.currentPage = currentPage;

  const recipes = await getRecipes(BASE_URL, searchTerm);

  const lastPage = Math.floor(recipes.length / 10) + 1;
  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;

  const recipesToDisplay = recipes.filter((recipe, i) => {
    if (currentPage === 1) {
      return i < currentPage * 10;
    } else {
      return i >= (currentPage - 1) * 10 && i < currentPage * 10;
    }
  });

  const recipeItemsToInsert = recipesToDisplay
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

  const btnNextHtml = `<button class="btn btn--paginate" id="paginate-next">
      <p>Page ${nextPage}</p>
      <svg class="nav-icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;

  const btnPrevHtml = `<button class="btn btn--paginate" id="paginate-prev">
  <svg class="nav-icon">
  <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <p>Page ${prevPage}</p>
    </button>`;

  spinner.classList.add("hidden");

  recipeListContainer.insertAdjacentHTML("afterbegin", recipeItemsToInsert);

  if (currentPage === 1) {
    btnContainer.insertAdjacentHTML("beforeend", btnNextHtml);
  } else if (currentPage === lastPage) {
    btnContainer.insertAdjacentHTML("afterbegin", btnPrevHtml);
  } else {
    btnContainer.insertAdjacentHTML("afterbegin", btnPrevHtml);
    btnContainer.insertAdjacentHTML("beforeend", btnNextHtml);
  }

  const recipeListItems = document.querySelectorAll(".recipe-list--item");
  const btnPrev = document.querySelector("#paginate-prev");
  const btnNext = document.querySelector("#paginate-next");

  recipeListItems.forEach((item) => {
    item.addEventListener("click", displayRecipe);
  });

  btnNext?.addEventListener("click", paginate);
  btnPrev?.addEventListener("click", paginate);
};
