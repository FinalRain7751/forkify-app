import View from "./View";

class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmark-list");
  _showBookmarkBtn = document.querySelector("#show-bookmarks");

  addHandlerBookmarks(loadBookmarks, handler) {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      loadBookmarks();
    });

    const event = new Event("custom_event");

    this._showBookmarkBtn.addEventListener("mouseover", showBookmarks);
    this._parentElement.addEventListener("mouseover", (e) => {
      e.preventDefault();

      this._showBookmarkBtn.removeEventListener("custom_event", hideBookmarks);
      handler();
    });

    this._showBookmarkBtn.addEventListener("custom_event", hideBookmarks);
    this._parentElement.addEventListener("custom_event", hideBookmarks);

    this._showBookmarkBtn.addEventListener("mouseout", (e) => {
      e.preventDefault();
      setTimeout(() => {
        this._showBookmarkBtn.dispatchEvent(event);
      }, 500);
    });

    this._parentElement.addEventListener("mouseout", (e) => {
      e.preventDefault();
      setTimeout(() => {
        this._parentElement.dispatchEvent(event);
      }, 500);
    });
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
