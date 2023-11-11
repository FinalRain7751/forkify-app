import View from "./View";

import icons from "url:../../images/icons.svg";

class RecipeView extends View {
  _parentElement = document.getElementById("recipe");
  _errorMsg = "We could not find that recipe. Please try another one!";
  _message = "";

  addHandlerRender(handler, updateServingsHandler, updateBookmarksHandler) {
    ["hashchange", "load"].forEach((event) => {
      window.addEventListener(event, async (e) => {
        e.preventDefault();

        this.renderMessage(
          "Start by searching for a recipe or an ingredient. Have fun!"
        );

        const recipeId = window.location.hash.slice(1);
        if (!recipeId) return;

        await handler(recipeId);
      });
    });

    this._parentElement.addEventListener("click", async (event) => {
      if (event.target.closest(".recipe--info-bookmark")) {
        let action;
        if (this._data.isBookmarked) {
          action = "remove";
        } else {
          action = "add";
        }
        updateBookmarksHandler(action);
      }

      if (event.target.closest("#increase-servings")) {
        updateServingsHandler("increase");
      }

      if (event.target.closest("#decrease-servings")) {
        updateServingsHandler("decrease");
      }
    });
  }

  _generateMarkup() {
    return `<div class="recipe--details">
    <div class="hero--section">
      <img src="${this._data.image}" alt="recipe image" />
    </div>
    <h2 class="recipe--title"><span>${this._data.title}</span></h2>
    <section class="recipe--info">
      <div>
        <p class="recipe--info-time">
          <svg class="nav-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          ${this._data.cookingTime} minutes
        </p>
        <div class="recipe--info-servings">
          <p>
            <svg class="nav-icon">
              <use href="src/images/${icons}#icon-users"></use>
            </svg>
          </p>
          <p>${this._data.servings} serving${
      this._data.servings === 1 ? "" : "s"
    }</p>
          <div class="recipe--info-servings_btn">
            <svg class="nav-icon" id='increase-servings'>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
            <svg class="nav-icon" id='decrease-servings'>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="recipe--info-bookmark">
        <svg class="nav-icon">
          <use href="${icons}#icon-bookmark${
      this._data.isBookmarked ? "" : "-fill"
    }"></use>
        </svg>
      </div>
    </section>
    <section class="recipe--ingredients flex-center">
      <ul>
        ${this._data.ingredients
          .map((ingredient) => {
            return `<li class="recipe--ingredients-item">
        <svg class="nav-icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div>${
          (ingredient.quantity ?? "") +
          " " +
          (ingredient.unit ?? "") +
          " " +
          ingredient.description
        }</div>
      </li>`;
          })
          .join("")}
      </ul>
    </section>
    <section class="recipe--directions">
      <h3>How to cook it</h3>
      <p>
        This recipe was carefully designed and tested by ${
          this._data.publisher
        }.
        Please check out directions at their website.
      </p>
      <a href="${this._data.sourceUrl}" class="btn btn--direction">
        Directions
        <svg class="search-icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </section>
  </div>`;
  }
}

export default new RecipeView();
