export const getRecipes = async (baseUrl, searchTerm) => {
  const url = baseUrl + `?search=${searchTerm}`;

  try {
    const response = await fetch(url);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData?.message ?? "Error"} (${response.status})`);
    }

    // console.log(resData.data.recipes);
    return resData.data.recipes;
  } catch (err) {
    alert(err);
  }
};

export const getRecipeById = async (baseUrl, id) => {
  const url = baseUrl + String(id);
  try {
    const response = await fetch(url);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData?.message ?? "Error"} (${response.status})`);
    }

    let { recipe } = resData.data;

    recipe = {
      ...recipe,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };

    return recipe;
  } catch (err) {
    alert(err);
  }
};
