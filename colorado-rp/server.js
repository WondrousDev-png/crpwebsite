const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();

// UPDATED: Use the system port if available (Required for Koyeb)
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ⚙️ SERVER SETTINGS
// ==========================================
// NOTE: For better security, consider adding this key to Koyeb's "Secrets" instead of hardcoding it here.
const ERLC_SERVER_KEY = 'mUcYPoJVCWQhtBtOWCNh-hxzlrqkUZdefaVrUrcYJOOqBEUQWRiEKtOnWQEZg'; 
const DISCORD_SERVER_ID = '1317032666331353099'; 
// ==========================================

// --- API ROUTE: Stats ---
app.get('/api/stats', async (req, res) => {
    let playerCount = 0;
    let maxPlayers = 40; 
    let isOnline = false;
    let discordCount = 0;

    try {
        // ERLC Check
        if (ERLC_SERVER_KEY !== 'PASTE_YOUR_KEY_HERE') {
            try {
                const erlcResponse = await axios.get('https://api.policeroleplay.community/v1/server', {
                    headers: { 'Server-Key': ERLC_SERVER_KEY }
                });
                if (erlcResponse.data) {
                    playerCount = erlcResponse.data.CurrentPlayers;
                    maxPlayers = erlcResponse.data.MaxPlayers;
                    isOnline = true;
                }
            } catch (e) { /* Ignore sleeping server */ }
        }

        // Discord Check (Widget)
        try {
            const discordResponse = await axios.get(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`);
            if (discordResponse.data) discordCount = discordResponse.data.presence_count; 
        } catch (e) { console.error("Discord Widget Error"); }

        res.json({ online: isOnline, players: playerCount, maxPlayers: maxPlayers, discord: discordCount });

    } catch (error) {
        res.json({ online: false, players: 0, maxPlayers: 40, discord: 0 });
    }
});

// --- PAGE ROUTES ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/rules', (req, res) => res.sendFile(path.join(__dirname, 'public', 'rules.html')));
app.get('/store', (req, res) => res.sendFile(path.join(__dirname, 'public', 'store.html')));
app.get('/photos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'photos.html')));

// --- FIXED FALLBACK (Prevent Crash) ---
app.use((req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`>> SERVER STARTED: Running on port ${PORT}`);
});
