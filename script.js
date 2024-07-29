document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipesContainer = document.getElementById('recipes-container');
    const uploadBtn = document.getElementById('upload-btn');
    const recipePopup = document.getElementById('recipe-popup');
    const editPopup = document.getElementById('edit-popup');
    const closeBtns = document.querySelectorAll('.close-btn');
    const editForm = document.getElementById('edit-form');

    // Load recipes from localStorage
    loadRecipes();

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
    }

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
        }

        reader.readAsDataURL(imageInput.files[0]);
    });

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
            }
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const recipe = recipes.find(recipe => recipe.id == id);
            image = recipe.image;
            updateRecipe({ id, name, ingredients, text, image });
        }
    });

    function saveRecipe(recipe) {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function loadRecipes() {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.forEach(recipe => displayRecipe(recipe));
    }

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
        recipeCard.addEventListener('click', (event) => {
            if (event.target.tagName !== 'BUTTON') {
                window.location.href = `recipe.html?id=${recipe.id}`;
            }
        });
        recipesContainer.appendChild(recipeCard);
    }

    window.editRecipe = function(id) {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const recipe = recipes.find(recipe => recipe.id == id);
        document.getElementById('edit-id').value = recipe.id;
        document.getElementById('edit-name').value = recipe.name;
        document.getElementById('edit-ingredients-container').innerHTML = recipe.ingredients.map(ingredient => `<input type="text" class="ingredient-input" value="${ingredient}" required>`).join('');
        document.getElementById('edit-text').value = recipe.text;
        editPopup.style.display = 'block';
    }

    window.deleteRecipe = function(id) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.filter(recipe => recipe.id != id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipesContainer.innerHTML = '';
        loadRecipes();
    }

    function updateRecipe(updatedRecipe) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.map(recipe => recipe.id == updatedRecipe.id ? updatedRecipe : recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipesContainer.innerHTML = '';
        loadRecipes();
        editPopup.style.display = 'none';
    }
});
