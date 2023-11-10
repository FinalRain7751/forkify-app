import { BASE_URL, SEARCH_RESULTS_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    lastPage: 1,
    results: [],
  },
  bookmarks: {
    recipeIds: [],
    recipes: [],
  },
};

export const loadRecipe = async (id) => {
  const url = BASE_URL + String(id);

  try {
    const resData = await getJSON(url);

    const { recipe } = resData.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(`${err} 😢🌋`);
    throw err;
  }
};

export const loadRecipesList = async (searchTerm) => {
  const url = BASE_URL + `?search=${searchTerm}`;

  try {
    const resData = await getJSON(url);

    const recipes = resData.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    state.search.results = recipes;
    state.search.query = searchTerm;
    state.search.lastPage =
      Math.floor(recipes.length / SEARCH_RESULTS_PER_PAGE) + 1;
  } catch (err) {
    console.error(`${err} 😢🌋`);
    throw err;
  }
};

export const getSearchResultsPerPage = (page = state.search.page) => {
  const start = (page - 1) * SEARCH_RESULTS_PER_PAGE;
  const end = page * SEARCH_RESULTS_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const loadBookmarks = () => {
  //Clear current loaded bookmarked recipes
  state.bookmarks.recipeIds =
    JSON.parse(localStorage.getItem("bookmarks")) ?? [];

  state.bookmarks.recipes = [];

  const recipeIds = state.bookmarks.recipeIds;
  if (recipeIds.length === 0) return;

  for (let i = 0; i < recipeIds.length; i++) {
    const id = recipeIds[i];

    getJSON(BASE_URL + id)
      .then((res) => {
        const { recipe } = res.data;
        state.bookmarks.recipes.push({
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          image: recipe.image_url,
        });
      })
      .catch((err) => {
        console.error(`${err} 😢🌋`);
        throw err;
      });
  }
};

export const updateBookmarks = async (action) => {
  const recipeId = state.recipe.id;
  if (action === "add") {
    state.bookmarks.recipeIds.push(recipeId);
  } else {
    state.bookmarks.recipeIds = state.bookmarks.recipeIds.filter(
      (id) => id !== recipeId
    );
  }

  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks.recipeIds));

  loadBookmarks();
};
