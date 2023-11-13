import View from "./View";

class AddRecipeView extends View {
  _modal = document.querySelector(".modal");
  _parentElement = document.querySelector(".add-new-recipe");
  _formSubmitBtn = document.querySelector("#submit-recipe");
  _showModalBtn = document.querySelector("#add-recipe");
  _hideModalBtn = this._modal.querySelector(".btn--close-modal");
  _overlay = document.querySelector(".overlay");

  _errorMsg = "";
  _message = "Recipe succesfully uploaded!🎉";

  showModal() {
    this._modal.classList.remove("hide");
    this._overlay.classList.remove("hide");
  }

  hideModal() {
    this._modal.classList.add("hide");
    this._overlay.classList.add("hide");
  }

  handleModal() {
    this._showModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.showModal();
    });

    this._hideModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.hideModal();
    });

    this._overlay.addEventListener("click", (e) => {
      e.preventDefault();

      if (!this._modal.classList.contains("hide")) {
        this.hideModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Escape" && !this._modal.classList.contains("hide")) {
        this.hideModal();
      }
    });
  }

  addHandlerUpload(handler) {
    this._formSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const formData = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(formData);
      handler(data);
    });
  }
}

export default new AddRecipeView();
