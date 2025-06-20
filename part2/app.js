const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: "woofwoof",
    resave: false,
    saveUninitialized: true
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute(
            `SELECT * FROM Users WHERE username = ? AND password_hash = ?`,
            [username, password]
        );

        if (rows.length === 0){
            return res.status(401).json({ error: "Invalid username/password"});
        }

        req.session.user = {
            id: rows[0].user_id,
            username: rows[0].username,
            role: rows[0].role
        };

        res.json({ role: rows[0].role });
    }catch (err){
        console.error(err);
        res.status(500).json({ error: "Wrong."});
    }
});

// Export the app instead of listening here
module.exports = app;