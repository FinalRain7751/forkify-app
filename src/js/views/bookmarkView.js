import View from "./View";

class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmark-list");
  _grandParentElement = document.querySelector(".nav-actions");
  _showBookmarkBtn = document.querySelector("#show-bookmarks");

  addHandlerBookmarks(handler) {
    window.addEventListener("load", async (event) => {
      event.preventDefault();

      this.renderMessage("No bookmarked recipes!");

      await handler();
    });
  }

  render(data) {
    if (!data) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    return this._data
      .map((recipe) => {
        return `
        <li class="bookmark-list--item">
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
      .join("");
  }
}

export default new BookmarkView();
