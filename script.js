document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipesContainer = document.getElementById('recipes-container');
    const uploadBtn = document.getElementById('upload-btn');
    const recipePopup = document.getElementById('recipe-popup');
    const editPopup = document.getElementById('edit-popup');
    const closeBtns = document.querySelectorAll('.close-btn');
    const editForm = document.getElementById('edit-form');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientsContainer = document.getElementById('ingredients-container');

    // Function to load recipes from localStorage
    function loadRecipes() {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.forEach(recipe => displayRecipe(recipe));
    }

    // Function to display a recipe card
    function displayRecipe(recipe) {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.ingredients.join(', ')}</p>
            <p>${recipe.text}</p>
            <div class="card-buttons">
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
            </div>
        `;

        // Add click event to the recipe card for redirecting to recipe.html
        recipeCard.addEventListener('click', () => {
            window.location.href = `recipe.html?id=${recipe.id}`;
        });

        recipesContainer.appendChild(recipeCard);
    }

    // Function to save a recipe
    function saveRecipe(recipe) {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    // Function to update a recipe
    function updateRecipe(updatedRecipe) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.map(recipe => recipe.id == updatedRecipe.id ? updatedRecipe : recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipesContainer.innerHTML = '';
        loadRecipes();
        editPopup.style.display = 'none';
    }

    // Function to delete a recipe
    window.deleteRecipe = function(id) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.filter(recipe => recipe.id != id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipesContainer.innerHTML = '';
        loadRecipes();
    };

    // Function to handle recipe form submission
    recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('recipe-name').value;
        const ingredients = Array.from(document.querySelectorAll('#ingredients-container .ingredient-input')).map(input => input.value);
        const text = document.getElementById('recipe-text').value;
        const imageInput = document.getElementById('recipe-image');
        const reader = new FileReader();

        reader.onload = function() {
            const image = reader.result;

            const recipe = { id: Date.now(), name, ingredients, text, image };
            saveRecipe(recipe);
            displayRecipe(recipe);

            recipeForm.reset();
            recipePopup.style.display = 'none';
        };

        if (imageInput.files.length > 0) {
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            alert('Please upload an image.');
        }
    });

    // Function to handle edit form submission
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('edit-id').value;
        const name = document.getElementById('edit-name').value;
        const ingredients = Array.from(document.querySelectorAll('#edit-ingredients-container .ingredient-input')).map(input => input.value);
        const text = document.getElementById('edit-text').value;
        const imageInput = document.getElementById('edit-image');
        let image;

        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function() {
                image = reader.result;
                updateRecipe({ id, name, ingredients, text, image });
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const recipe = recipes.find(recipe => recipe.id == id);
            image = recipe.image;
            updateRecipe({ id, name, ingredients, text, image });
        }
    });

    // Function to add a new ingredient input field
    function addIngredientField() {
        const newIngredientInput = document.createElement('input');
        newIngredientInput.type = 'text';
        newIngredientInput.className = 'ingredient-input';
        newIngredientInput.placeholder = 'Ingredient';
        newIngredientInput.required = true;

        ingredientsContainer.appendChild(newIngredientInput);
    }

    // Event listeners for buttons
    uploadBtn.addEventListener('click', () => {
        recipePopup.style.display = 'block';
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            recipePopup.style.display = 'none';
            editPopup.style.display = 'none';
        });
    });

    window.onclick = function(event) {
        if (event.target == recipePopup) {
            recipePopup.style.display = 'none';
        }
        if (event.target == editPopup) {
            editPopup.style.display = 'none';
        }
    };

    addIngredientBtn.addEventListener('click', addIngredientField);

    // Initial load of recipes
    loadRecipes();
});
