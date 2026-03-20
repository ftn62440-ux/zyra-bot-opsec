const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('🤖 OPSEC LEGENDAIRE v4.0 ✅ Alive !\n👥 Users: ' + process.env.USERS || 0);
});

server.listen(process.env.PORT || 3000, () => {
    console.log('🌐 Keepalive server ON → Port ' + (process.env.PORT || 3000));
});

// 🔄 PING AUTO toutes les 25min (Render gratuit = 15min timeout)
setInterval(() => {
    http.get('http://ton-bot-opsec.onrender.com/', (resp) => {
        console.log('🔄 Auto-ping → Bot alive !');
    }).on('error', (e) => {
        console.log('❌ Ping failed: ', e.message);
    });
}, 25 * 60 * 1000); // 25min