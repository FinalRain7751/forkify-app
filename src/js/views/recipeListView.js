import icons from "url:../../images/icons.svg";
import View from "./View";

class RecipeListView extends View {
  _parentElement = document.querySelector("#recipeList");
  _errorMsg = "No matching recipe found. Please try searching something else!";
  _message = "";

  _generateMarkup() {
    return `${this._data
      .map((recipe) => {
        return `
        <li data-id=${recipe.id} class="recipe-list--item">
            <a href="#${recipe.id}">
                <img src="${recipe.image}" alt="small recipe image" />
                <div>
                    <h4>${recipe.title}</h4>
                    <p>${recipe.publisher}</p>
                </div>
            </a>
        </li>
        `;
      })
      .join("")};
    `;
  }
}

export default new RecipeListView();
