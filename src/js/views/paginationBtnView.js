import icons from "url:../../images/icons.svg";

import View from "./View";

class PaginationBtnView extends View {
  _parentElement = document.querySelector(".pagination-actions");
  _event;
  _targetPage;

  _generateMarkup() {
    let markup = "";

    const lastPage = this._data.lastPage;
    const currentPage = this._data.currentPage;
    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;

    const btnNextHtml = `
      <button class="btn btn--paginate" id="paginate-next"    data-to-page='${nextPage}'>
        <p>Page ${nextPage}</p>
        <svg class="nav-icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;

    const btnPrevHtml = `
      <button class="btn btn--paginate" id="paginate-prev" data-to-page='${prevPage}'>
        <svg class="nav-icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <p>Page ${prevPage}</p>
      </button>
      `;

    console.log(currentPage, lastPage);

    if (currentPage === 1 && lastPage !== 1) {
      markup = btnNextHtml;
    } else if (currentPage === lastPage && lastPage !== 1) {
      markup = btnPrevHtml;
    } else if (lastPage !== 1) {
      markup = btnPrevHtml + btnNextHtml;
    }

    return markup;
  }

  getTargetPage() {
    return this._targetPage;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener("click", (event) => {
      event.preventDefault();

      //   if (event.target.closest("#paginate-next")) {
      //     this._event = "next";
      //   } else if (event.target.closest("#paginate-prev")) {
      //     this._event = "prev";
      //   }

      console.log(event.target.closest(".btn--paginate").dataset.toPage);

      this._targetPage = Number(
        event.target.closest(".btn--paginate").dataset.toPage
      );

      handler();
    });
  }
}

export default new PaginationBtnView();
