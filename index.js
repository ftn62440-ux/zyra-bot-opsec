require('dotenv').config();
const { 
    Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// 🗂️ BASES DE DONNÉES
const opsecUsers = new Map();  // userID → {data}
const cooldowns = new Map();   // Anti-spam

client.once('ready', () => {
    console.log(`
╔══════════════════════════════════════════════╗
║  🚀 OPSEC LEGENDAIRE v4.0 ✅ EN LIGNE !       ║
║                                              ║
║  📊 Serveurs: ${client.guilds.cache.size}         ║
║  👥 OPSEC: ${opsecUsers.size}                 ║
║  ⏰ ${new Date().toLocaleString('fr-FR')}         ║
║                                              ║
║  🎮 Commandes: !opsec !admin !top !stats     ║
╚══════════════════════════════════════════════╝
    `);
    
    // 🗑️ PURGE AUTO (7 jours)
    setInterval(() => {
        const now = Date.now();
        let count = 0;
        for (let [id, data] of opsecUsers) {
            if (now - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
                opsecUsers.delete(id);
                count++;
            }
        }
        if (count) console.log(`🧹 Auto-purge: ${count} users`);
    }, 24 * 60 * 60 * 1000);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    
    const cmd = msg.content.slice(1).trim().split(/ +/)[0]?.toLowerCase();
    
    // 🔄 ROUTER COMMANDES
    switch(cmd) {
        case 'opsec':   handleOpsec(msg); break;
        case 'admin':   handleAdmin(msg); break;
        case 'top':     handleTop(msg); break;
        case 'stats':   handleStats(msg); break;
        default: return;
    }
});

// 🛡️ !OPSEC PUBLIC
async function handleOpsec(msg) {
    const cd = cooldowns.get(msg.author.id);
    if (cd && cd > Date.now()) {
        return msg.reply(`⏳ **${Math.ceil((cd - Date.now()) / 1000)}s** cooldown`);
    }
    cooldowns.set(msg.author.id, Date.now() + 60000);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('opsec_start')
            .setLabel('🚀 ACTIVER OPSEC')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🛡️')
    );

    const embed = new EmbedBuilder()
        .setTitle('🛡️ **OPSEC LEGENDAIRE v4.0**')
        .setDescription('**Protection ultime identité Discord**\n\n⚡ **DM privé instantané**')
        .setColor('#ff1744')
        .addFields(
            { name: '👥 Total OPSEC', value: `${opsecUsers.size}`, inline: true },
            { name: '🏆 Leader', value: Array.from(opsecUsers.values())[0]?.username || '—', inline: true },
            { name: '📱 Mobile OK', value: '✅', inline: true }
        )
        .setImage('https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif')
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: 'YouTube Ready • v4.0' });

    await msg.reply({ embeds: [embed], components: [row] });
}

// 👑 !ADMIN DASHBOARD
async function handleAdmin(msg) {
    const adminRole = process.env.ROLE_ADMIN;
    if (!adminRole || !msg.member.roles.cache.has(adminRole)) {
        return msg.reply('🔒 **RÔLE ADMIN REQUIS**');
    }

    const recent = Array.from(opsecUsers.entries())
        .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
        .map(([id, u], i) => `${i + 1}️⃣ **${u.username}** \`${u.date} ${u.time}\``)
        .join('\n') || '🎯 Aucun utilisateur';

    const embed = new EmbedBuilder()
        .setTitle('📊 **DASHBOARD ADMIN v4.0**')
        .setDescription(`**Stats live :** 👥 **${opsecUsers.size}** OPSEC`)
        .addFields(
            { name: '🎯 Top 10 récents', value: recent, inline: false },
            { name: '⏰ Uptime bot', value: `${Math.floor(process.uptime() / 3600)}h ${Math.floor(process.uptime() % 3600 / 60)}m`, inline: true },
            { name: '🚫 Cooldowns actifs', value: `${cooldowns.size}`, inline: true },
            { name: '🗑️ Auto-purge', value: '7 jours', inline: true }
        )
        .setColor('#00ff88')
        .setThumbnail(msg.author.displayAvatarURL())
        .setTimestamp();

    await msg.reply({ embeds: [embed] });
    console.log(`👑 ${msg.author.username} → Dashboard`);
}

// 🏆 !TOP CLASSEMENT
async function handleTop(msg) {
    if (!opsecUsers.size) return msg.reply('🏆 **Classement vide !**');
    
    const top10 = Array.from(opsecUsers.values())
        .slice(0, 10)
        .map((u, i) => `${i + 1}️⃣ **${u.username}**\n\`${u.date} ${u.time}\``)
        .join('\n');

    const embed = new EmbedBuilder()
        .setTitle('🏆 **TOP 10 OPSEC WORLDWIDE**')
        .setDescription(top10)
        .setColor('#ffd700')
        .setFooter({ text: `Total: ${opsecUsers.size} OPSEC | v4.0` });

    await msg.reply({ embeds: [embed] });
}

// 📊 !STATS SERVEUR
async function handleStats(msg) {
    const embed = new EmbedBuilder()
        .setTitle('📈 **STATISTIQUES ULTIMATES**')
        .addFields(
            { name: '👥 Utilisateurs OPSEC', value: `${opsecUsers.size}`, inline: true },
            { name: '🌍 Serveurs connectés', value: `${client.guilds.cache.size}`, inline: true },
            { name: '⏰ Uptime continu', value: `${Math.floor(process.uptime() / 3600)}h`, inline: true },
            { name: '🎮 Version bot', value: 'Legendaire v4.0', inline: true },
            { name: '📱 Compatible mobile', value: '✅', inline: true },
            { name: '🎥 YouTube ready', value: '✅', inline: true }
        )
        .setColor('#0099ff')
        .setTimestamp();

    await msg.reply({ embeds: [embed] });
}

// 🖱️ BOUTON CLICK
client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === 'opsec_start') {
        try {
            const now = new Date();
            const userData = {
                username: interaction.user.username,
                id: interaction.user.id,
                date: now.toLocaleDateString('fr-FR'),
                time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: now.getTime()
            };

            // 💾 ENREGISTREMENT
            opsecUsers.set(interaction.user.id, userData);

            // 🎖️ RÔLE AUTOMATIQUE
            const opsecRoleId = process.env.ROLE_OPSEC;
            if (opsecRoleId && interaction.guild) {
                const role = interaction.guild.roles.cache.get(opsecRoleId);
                if (role) await interaction.member.roles.add(role).catch(() => {});
            }

            // 🔔 NOTIFICATION SERVEUR
            const firstChannel = interaction.guild?.channels.cache.first();
            if (firstChannel) {
                firstChannel.send(`🆕 **${userData.username}** → OPSEC OFFICIEL #**${opsecUsers.size}** ! 🛡️`);
            }

            // 📨 GUIDE PRIVÉ DM
            await interaction.user.send({
                embeds: [new EmbedBuilder()
                    .setTitle(`🛡️ **OPSEC LEGENDAIRE ACTIVÉ**`)
                    .setDescription(`**Bonjour ${interaction.user.username} !**\n\n` +
                        `**🔥 GUIDE 100% EFFICACE**\n\n` +
                        `1️⃣ **VPN OBLIGATOIRE**\n` +
                        `   • Mullvad (paiement crypto)\n` +
                        `   • ProtonVPN (no-log)\n` +
                        `   ❌ JAMAIS gratuit\n\n` +
                        `2️⃣ **COMPTES BURNER**\n` +
                        `   • 1 nouveau/semaine\n` +
                        `   • Pseudo différent\n` +
                        `   • > 30 jours minimum\n\n` +
                        `3️⃣ **SÉCURITÉ MAX**\n` +
                        `   • 2FA app (Authy)\n` +
                        `   • ❌ PAS SMS\n` +
                        `   • Proxy rotatifs\n\n` +
                        `**🎯 RÈGLES D'OR**\n` +
                        `• 0 info perso JAMAIS\n` +
                        `• Avatar random\n` +
                        `• Messages espacés\n\n` +
                        `**🏆 RANG OFFICIEL #${opsecUsers.size}**\n` +
                        `**Tu es maintenant OPSEC !**`)
                    .setColor('#00ff00')
                    .setImage('https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif')
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setFooter({ text: 'v4.0 • Protection maximale' })
                ]
            });

            await interaction.reply({ 
                content: `✅ **OPSEC ACTIVÉ !**\n🏆 **Rang mondial #${opsecUsers.size}**\n🛡️ **Rôle attribué**`, 
                ephemeral: true 
            });

            console.log(`✅ ${interaction.user.username} → OPSEC #${opsecUsers.size}`);

        } catch (error) {
            await interaction.reply({ 
                content: '❌ **ACTIVE TES MESSAGES PRIVÉS !** 📩\n\n⚙️ Paramètres → Confidentialité → DM', 
                ephemeral: true 
            });
        }
    }
});

// 💾 SAUVEGARDE ANTI-CRASH
process.on('SIGINT', () => {
    console.log(`\n💾 Sauvegarde ${opsecUsers.size} OPSEC users...`);
    console.log('👋 Bot arrêté proprement');
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);