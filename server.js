require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        status: '🚀 OPSEC LEGENDAIRE v4.0',
        uptime: process.uptime(),
        opsec_users: process.env.USERS || 0,
        timestamp: new Date().toISOString()
    });
});

app.get('/ping', (req, res) => {
    res.json({ alive: true, message: '🤖 Bot 24/7 OK !' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🌐 Web server ON → https://ton-bot.onrender.com:${port}`);
});