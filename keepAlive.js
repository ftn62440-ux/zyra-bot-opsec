require('dotenv').config();
const express = require('express');
const app = express();

// CORS pour UptimeRobot
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'OPSEC v4.0', 
        alive: true, 
        time: new Date().toISOString()
    });
});

app.get('/ping', (req, res) => {
    res.status(200).json({ 
        alive: true, 
        status: 'up', 
        response_time: Date.now()
    });
});

// 🔥 PORT RENDER OBLIGATOIRE
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {  // ← 0.0.0.0 IMPORTANT
    console.log(`\n🌐 ✅ PORT ${port} LIVE !`);
    console.log(`📡 Test: http://localhost:${port}/ping`);
});

// Self-ping
setInterval(async () => {
    try {
        await fetch(`http://localhost:${port}/ping`);
        console.log('🔄 Self-ping OK');
    } catch(e) {}
}, 10 * 60 * 1000);

global.opsecCount = 0;
module.exports = app;  // Export pour Render