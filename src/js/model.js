import { API_KEY, BASE_URL, SEARCH_RESULTS_PER_PAGE } from "./config";
import { getJSON, sendJSON } from "./helpers";

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

export const createRecipeObject = (recipe) => {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    isBookmarked: state.bookmarks.recipeIds.includes(recipe.id),
  };
};

export const loadRecipe = async (id) => {
  const url = BASE_URL + String(id) + `?key=${API_KEY}`;

  try {
    const resData = await getJSON(url);
    const { recipe } = resData.data;
    state.recipe = createRecipeObject(recipe);
  } catch (err) {
    console.error(`${err} 😢🌋`);
    throw err;
  }
};

export const loadRecipesList = async (searchTerm) => {
  const url = BASE_URL + `?search=${searchTerm}&key=${API_KEY}`;

  try {
    const resData = await getJSON(url);

    const recipes = resData.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.results = recipes;
    state.search.query = searchTerm;
    state.search.page = 1;
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

export const loadBookmarks = async () => {
  //Clear current loaded bookmarked recipes
  state.bookmarks.recipes = [];

  let storedBookmarks;
  storedBookmarks = localStorage.getItem("bookmarks");

  if (!storedBookmarks) {
    state.bookmarks.recipeIds = [];
    return;
  }

  state.bookmarks.recipeIds = JSON.parse(storedBookmarks);

  const recipeIds = state.bookmarks.recipeIds;

  if (recipeIds.length === 0) return;

  try {
    const res = Promise.all(
      recipeIds.map((id) => getJSON(BASE_URL + id + `?key=${API_KEY}`))
    );

    const recipesData = await res;

    state.bookmarks.recipes = recipesData.map((data) => {
      const { recipe } = data.data;
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.error(`${err} 😢🌋`);
    throw err;
  }
};

export const updateBookmarks = (newBookmarksIds, newBookmarks) => {
  state.recipe.isBookmarked = !state.recipe.isBookmarked;
  state.bookmarks.recipeIds = newBookmarksIds;
  state.bookmarks.recipes = newBookmarks;

  localStorage.setItem("bookmarks", JSON.stringify(newBookmarksIds));
};

export const updateServings = (newServings) => {
  const currIngredients = state.recipe.ingredients;
  const currServings = state.recipe.servings;

  state.recipe.servings = newServings;
  state.recipe.ingredients = currIngredients.map((ing) => {
    const quantity = (ing.quantity / currServings) * newServings;
    return {
      ...ing,
      quantity: quantity === 0 ? null : quantity,
    };
  });
};

export const uploadRecipe = async (newRecipe) => {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].replaceAll(" ", "").split(",");

        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format. Please use correct format. 😁"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      isBookmarked: true,
    };
    // console.log(recipe);

    const data = await sendJSON(`${BASE_URL}?key=${API_KEY}`, recipe);

    state.bookmarks.recipeIds.push(data.data.recipe.id);
    localStorage.setItem(
      "bookmarks",
      JSON.stringify(state.bookmarks.recipeIds)
    );

    state.recipe = createRecipeObject(data.data.recipe);
    state.bookmarks.recipes.push(state.recipe);
    // console.log(data);
  } catch (err) {
    throw new Error(err);
  }
};
