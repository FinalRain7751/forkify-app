import { displayRecipeList } from "./displayRecipeList";

export default function paginate(event) {
  event.preventDefault();

  const btn = event.target.closest(".btn--paginate");

  const searchTerm = btn.closest(".pagination-actions").dataset.search;

  let currentPage = Number(
    btn.closest(".pagination-actions").dataset.currentPage
  );

  if (btn.id === "paginate-prev") {
    displayRecipeList(searchTerm, --currentPage);
  }
  if (btn.id === "paginate-next") {
    displayRecipeList(searchTerm, ++currentPage);
  }
}
