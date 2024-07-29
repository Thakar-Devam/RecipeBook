document.addEventListener("DOMContentLoaded", () => {
  const recipeDetails = document.getElementById("recipe-details");
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  console.log(`Looking for recipe with ID: ${recipeId}`);

  // Retrieve all recipes from localStorage
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  console.log("Recipes in localStorage:", recipes);

  // Find the recipe with the given ID
  let filteredRecipe = recipes.find((recipe) => recipe.id == recipeId);

  if (filteredRecipe) {
    console.log("Found recipe:", filteredRecipe);
    recipeDetails.innerHTML = `
        <h2>${filteredRecipe.name}</h2>
        <div class="recipe-content">
            <img src="${filteredRecipe.image}" alt="${filteredRecipe.name}">
            <div class="recipe-details">
                <h3>Ingredients</h3>
                <ul>${filteredRecipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}</ul>
                <h3>Instructions</h3>
                <p>${filteredRecipe.text}</p>
            </div>
        </div>
    `;
  } else {
    console.log("Recipe not found.");
    recipeDetails.innerHTML = `<p>Recipe not found.</p>`;
  }
});
