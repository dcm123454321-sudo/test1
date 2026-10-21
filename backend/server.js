
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check server and database
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            status: "ok",
            message: "USTH Twitter server is running",
            database: "connected"
        });
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(503).json({
            status: "error",
            message: "Database unavailable"
        });
    }
});

// Get all posts, newest first
app.get("/api/posts", async (req, res) => {
    try {
        const [posts] = await db.query(
            `SELECT id, username, content, created_at
             FROM posts
             ORDER BY id DESC`
        );

        res.json({ posts });
    } catch (error) {
        console.error("GET posts error:", error.message);

        res.status(500).json({
            error: "Unable to retrieve posts"
        });
    }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
    const { username, content } = req.body || {};

    if (
        typeof username !== "string" ||
        !username.trim() ||
        typeof content !== "string" ||
        !content.trim() ||
        content.length > 280
    ) {
        return res.status(400).json({
            error: "Valid username and content (max 280 characters) required"
        });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO posts (username, content) VALUES (?, ?)",
            [username.trim(), content.trim()]
        );

        const [rows] = await db.execute(
            `SELECT id, username, content, created_at
             FROM posts WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            post: rows[0]
        });
    } catch (error) {
        console.error("POST error:", error.message);

        res.status(500).json({
            error: "Unable to create post"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
