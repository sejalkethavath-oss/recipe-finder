async function searchRecipes() {

    const input = document.getElementById("searchInput");
    const searchType = document.getElementById("searchType");

    const query = input.value.trim();

    const recipesContainer = document.getElementById("recipes");
    const message = document.getElementById("message");
    const detailsContainer = document.getElementById("recipeDetails");

    // Clear previous results
    recipesContainer.innerHTML = "";
    detailsContainer.innerHTML = "";

    if (query === "") {

        message.innerHTML = "⚠️ Please enter a dish name or ingredient.";

        return;
    }

    message.innerHTML = "🔄 Searching recipes...";

    try {

        let url;

        if (searchType.value === "dish") {

            url = `/api/search?query=${encodeURIComponent(query)}`;

        } else {

            url = `/api/ingredient?ingredient=${encodeURIComponent(query)}`;

        }

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        if (!data.meals) {

            message.innerHTML =
                "❌ No recipes found. Try another search.";

            return;
        }

        message.innerHTML =
            `✅ Found ${data.meals.length} recipe(s)`;

        displayRecipes(data.meals);

    } catch (error) {

        console.error(error);

        message.innerHTML =
            "❌ Something went wrong. Please try again.";

    }
}


// Display recipe cards

function displayRecipes(meals) {

    const recipesContainer =
        document.getElementById("recipes");

    recipesContainer.innerHTML = "";

    meals.forEach(meal => {

        const card = document.createElement("div");

        card.className = "recipe-card";

        card.innerHTML = `
            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            <div class="recipe-card-content">

                <h3>${meal.strMeal}</h3>

                <p>
                    🍽️ Category:
                    ${meal.strCategory || "Not available"}
                </p>

                <p>
                    🌍 Cuisine:
                    ${meal.strArea || "Not available"}
                </p>

                <button
                    class="view-button"
                    onclick="viewRecipe('${meal.idMeal}')"
                >
                    View Recipe
                </button>

            </div>
        `;

        recipesContainer.appendChild(card);

    });
}


// Get complete recipe

async function viewRecipe(id) {

    const detailsContainer =
        document.getElementById("recipeDetails");

    detailsContainer.innerHTML =
        "<p>🔄 Loading recipe...</p>";

    try {

        const response =
            await fetch(`/api/recipe/${id}`);

        const data =
            await response.json();

        if (!data.meals) {

            detailsContainer.innerHTML =
                "<p>Recipe details not found.</p>";

            return;
        }

        const meal = data.meals[0];

        displayRecipeDetails(meal);

    } catch (error) {

        console.error(error);

        detailsContainer.innerHTML =
            "<p>❌ Unable to load recipe details.</p>";
    }
}


// Display complete recipe

function displayRecipeDetails(meal) {

    const detailsContainer =
        document.getElementById("recipeDetails");

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {

        const ingredient =
            meal[`strIngredient${i}`];

        const measure =
            meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {

            ingredients.push(
                `${measure || ""} ${ingredient}`
            );
        }
    }

    detailsContainer.innerHTML = `

        <div class="recipe-details">

            <h2>${meal.strMeal}</h2>

            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            <div class="info">

                <p>
                    <strong>🍽️ Category:</strong>
                    ${meal.strCategory || "Not available"}
                </p>

                <p>
                    <strong>🌍 Cuisine:</strong>
                    ${meal.strArea || "Not available"}
                </p>

                <p>
                    <strong>⏱️ Cooking Time:</strong>
                    Approximately 30-45 minutes
                </p>

            </div>

            <h3>🥕 Ingredients</h3>

            <ul>
                ${ingredients
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

            <h3>📋 Cooking Instructions</h3>

            <p>
                ${meal.strInstructions}
            </p>

        </div>
    `;

    // Scroll to recipe
    detailsContainer.scrollIntoView({
        behavior: "smooth"
    });
}


// Allow Enter key to search

document
    .getElementById("searchInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            searchRecipes();

        }

    });