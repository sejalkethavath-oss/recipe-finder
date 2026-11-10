const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Search recipes by dish name
app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({
                error: "Please enter a recipe or ingredient."
            });
        }

        const url =
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to connect to recipe API");
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to fetch recipes."
        });
    }
});

// Search recipes by ingredient
app.get("/api/ingredient", async (req, res) => {
    try {
        const ingredient = req.query.ingredient;

        if (!ingredient) {
            return res.status(400).json({
                error: "Please enter an ingredient."
            });
        }

        const url =
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to connect to recipe API");
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to fetch recipes."
        });
    }
});

// Get complete recipe details
app.get("/api/recipe/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const url =
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to connect to recipe API");
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to fetch recipe details."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Recipe Finder App running on port ${PORT}`);
});