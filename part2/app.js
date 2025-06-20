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
            return res.render('login', { error: "Invalid"});
        }

        req.session.user = {
            id: rows[0].user_id,
            username: rows[0].username,
            role: rows[0].role
        };

        if(rows[0].role === 'owner'){
            res.redirect('/owner');
        }else if (rows[0].role === 'walker'){
            res.redirect('/walker');
        }else{
            res.render()
        }
    }
})

// Export the app instead of listening here
module.exports = app;