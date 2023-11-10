class SearchView {
  _parentElement = document.querySelector(".nav-form");
  _query = "";
  _searchInputElement = document.querySelector(".nav-form--input");
  _searchBtn = document.querySelector(".btn--search");

  getQuery() {
    this._clearInput();
    return this._query;
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const searchTerm = formData.get("search");

      this._query = searchTerm;
      await handler();
    });
  }

  _clearInput() {
    const input = this._parentElement.querySelector("input");
    input.value = "";
    input.blur();
  }

  searchBarAnimation() {
    this._searchInputElement.addEventListener("focus", (e) => {
      e.preventDefault();
      this._searchBtn.classList.add("btn--search-translateY");
    });

    this._searchInputElement.addEventListener("blur", (e) => {
      e.preventDefault();
      this._searchBtn.classList.remove("btn--search-translateY");
    });
  }
}

export default new SearchView();
