import { BASE_URL } from "./index";
import { getRecipeById } from "./getData";
import icons from "url:../images/icons.svg";

const recipeDiv = document.getElementById("recipe");
const noRecipeSelectedMessageDiv = document.querySelector(
  ".no-recipe-selected"
);
const spinner = document.querySelector(".recipe .spinner");

export default async function displayRecipe(event) {
  event.preventDefault();

  noRecipeSelectedMessageDiv.classList.remove("hidden");
  noRecipeSelectedMessageDiv.classList.add("hidden");
  spinner.classList.remove("hidden");
  recipeDiv.innerHTML = "";

  console.log(event.target);
  const recipeId = event.target.dataset.id;

  const recipe = await getRecipeById(BASE_URL, recipeId);

  // console.log(recipe);

  const ingLength = recipe.ingredients.length;

  let ing1Length;
  if (ingLength % 2 === 0) {
    ing1Length = ingLength / 2;
  } else {
    ing1Length = Math.floor(ingLength / 2) + 1;
  }

  const ingredients1 = [...recipe.ingredients]
    .splice(0, ing1Length)
    .map((ingredient) => {
      return `<li class="recipe--ingredients-item">
  <svg class="nav-icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <p>${
    ingredient.quantity + " " + ingredient.unit + " " + ingredient.description
  }</p>
</li>`;
    })
    .join("");

  const ingredients2 = [...recipe.ingredients]
    .splice(ing1Length)
    .map((ingredient) => {
      return `<li class="recipe--ingredients-item">
    <svg class="nav-icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <p>${
      ingredient.quantity + " " + ingredient.unit + " " + ingredient.description
    }</p>
  </li>`;
    })
    .join("");

  const htmlToInsert = `<div class="recipe--details">
  <div class="hero--section">
    <img src="${recipe.image}" alt="recipe image" />
  </div>
  <h2 class="recipe--title"><span>${recipe.title}</span></h2>
  <section class="recipe--info">
    <div>
      <p class="recipe--info-time">
        <svg class="nav-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        ${recipe.cookingTime} minutes
      </p>
      <div class="recipe--info-servings">
        <p>
          <svg class="nav-icon">
            <use href="src/images/${icons}#icon-users"></use>
          </svg>
        </p>
        <p>${recipe.servings} servings</p>
        <div class="recipe--info-servings_btn">
          <svg class="nav-icon">
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
          <svg class="nav-icon">
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="recipe--info-bookmark">
      <svg class="nav-icon">
        <use href="${icons}#icon-bookmark-fill"></use>
      </svg>
    </div>
  </section>
  <section class="recipe--ingredients">
    <ul>
      ${ingredients1}      
    </ul>
    <ul>
      ${ingredients2}
    </ul>
  </section>
  <section class="recipe--directions">
    <h3>How to cook it</h3>
    <p>
      This recipe was carefully designed and tested by ${recipe.publisher}.
      Please check out directions at their website.
    </p>
    <a href="${recipe.sourceUrl}" class="btn btn--direction">
      Directions
      <svg class="search-icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </section>
</div>`;

  spinner.classList.add("hidden");
  recipeDiv.insertAdjacentHTML("afterbegin", htmlToInsert);
}
