import View from "./View";
import recipeItemView from "./recipeItemView";

class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmark-list");
  _errorMsg = "No bookmarks yet! Add some😀";

  addHandlerBookmarks(handler) {
    window.addEventListener("load", async (event) => {
      event.preventDefault();
      await handler();
    });
  }

  _generateMarkup() {
    return this._data
      .map((item) => recipeItemView.render(item, false))
      .join("");
  }
}

export default new BookmarkView();
