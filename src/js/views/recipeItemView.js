import View from "./View";
import icons from "url:../../images/icons.svg";

class recipeItemView extends View {
  _parentElement = "";

  _generateMarkup() {
    return `
        <li class="recipe-list--item ${
          window.location.hash?.slice(1) === this._data.id ? "selected" : ""
        }">
            <a href="/#${this._data.id}">
                <img src="${this._data.image}" alt="small recipe image" />
                <div>
                    <h4>${this._data.title}</h4>
                    <p>${this._data.publisher}</p>
                </div>
                ${
                  this._data.key
                    ? `<svg class="user-icon">
                      <use href="${icons}#icon-user"></use>
                    </svg>
                `
                    : ""
                }
            </a>
        </li>`;
  }
}

export default new recipeItemView();
