import icons from "url:../../images/icons.svg";
import View from "./View";
import recipeItemView from "./recipeItemView";

class RecipeListView extends View {
  _parentElement = document.querySelector("#recipeList");
  _errorMsg = "No matching recipe found. Please try searching something else!";
  _message = "";

  showCurrRecipeSelection() {
    document.addEventListener("click", (e) => {
      const target = e.target.closest(".recipe-list--item");
      if (!target) return;
      const currSelectedRecipe = this._parentElement.querySelector(".selected");
      if (currSelectedRecipe) {
        currSelectedRecipe.classList.remove("selected");
      }
      target.classList.add("selected");
    });
  }

  _generateMarkup() {
    return `${this._data
      .map((recipe) => recipeItemView.render(recipe, false))
      .join("")};
    `;
  }
}

export default new RecipeListView();
