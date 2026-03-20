require('dotenv').config();
const express = require('express');
const app = express();

// Middleware pour logs
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} → ${req.method} ${req.url}`);
    next();
});

// 🏠 PAGE D'ACCUEIL
app.get('/', (req, res) => {
    res.json({
        status: '🚀 OPSEC LEGENDAIRE v4.0 ✅',
        discord: 'Bot 24/7 LIVE',
        opsec_users: global.opsecCount || 0,
        uptime: Math.floor(process.uptime() / 60),
        timestamp: new Date().toISOString()
    });
});

// 🔍 PING STATUS
app.get('/ping', (req, res) => {
    res.json({ 
        alive: true, 
        message: '🤖 Bot immortel !',
        users: global.opsecCount || 0 
    });
});

// 📊 API STATS
app.get('/stats', (req, res) => {
    res.json({
        opsec_total: global.opsecCount || 0,
        uptime_minutes: Math.floor(process.uptime() / 60),
        memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB'
    });
});

// ⚙️ PORT DYNAMIQUE RENDER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`\n🌐 SERVEUR LIVE → http://localhost:${port}`);
    console.log(`📡 URLs:`);
    console.log(`   🏠 Home:    /`);
    console.log(`   🔍 Ping:    /ping`);
    console.log(`   📊 Stats:   /stats`);
    console.log(`\n✅ PORT ${port} ✅ Render détecté !`);
});

// 🔄 AUTO-PING (15min Render gratuit)
setInterval(() => {
    const pingUrl = `http://localhost:${port}/ping`;
    fetch(pingUrl).then(() => {
        console.log('🔄 Auto-ping OK');
    }).catch(e => {
        console.log('⚠️ Ping local failed');
    });
}, 14 * 60 * 1000);

// 💾 EXPORT GLOBAL pour bot
global.opsecCount = 0;