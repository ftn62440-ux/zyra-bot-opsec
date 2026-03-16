require("dotenv").config();
require("./keepAlive"); // KeepAlive pour Render

const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType
} = require("discord.js");

// Gestion globale des erreurs pour éviter les crashes
process.on("unhandledRejection", (reason) => {
    console.log("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.TOKEN;
const channelId = process.env.CHANNEL_ID;

// Quand le bot est prêt
client.once("ready", async () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(channelId);

        const embed = new EmbedBuilder()
            .setTitle("🔐 Comment devenir OPSEC")
            .setDescription(
`Tu veux apprendre les bases de **l’OPSEC (Operational Security)** ?

Clique sur le bouton ci-dessous pour recevoir un **guide complet en message privé**.

Tu apprendras :
• ce qu'est l'OPSEC
• les bases de la sécurité en ligne
• comment protéger tes informations`
            )
            .setColor("Blue");

        const button = new ButtonBuilder()
            .setCustomId("opsec_button")
            .setLabel("📩 Cliquer pour voir comment devenir OPSEC")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await channel.send({ embeds: [embed], components: [row] });
        console.log("Embed OPSEC envoyé dans le salon !");
    } catch (error) {
        console.log("Erreur lors de l'envoi de l'embed :", error);
    }
});

// Interaction bouton
client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "opsec_button") {

        // Détails à inclure directement sous chaque numéro
        const details = {
            "1": "1️⃣ **Ne jamais partager d'informations personnelles**\n- Ne divulguez jamais votre vrai nom, adresse, téléphone ou autres informations sensibles en ligne.",
            "2": "2️⃣ **Utiliser des mots de passe forts**\n- Utilisez des mots de passe uniques, longs, avec majuscules, chiffres et symboles.\n- Un gestionnaire de mots de passe peut aider.",
            "3": "3️⃣ **Activer la double authentification**\n- Ajoutez une couche de sécurité supplémentaire à vos comptes importants pour éviter les accès non autorisés.",
            "4": "4️⃣ **Utiliser un VPN sur les réseaux publics**\n- Le VPN chiffre votre connexion sur les réseaux Wi-Fi publics, protégeant vos données contre les espions.",
            "5": "5️⃣ **Faire attention aux liens et fichiers suspects**\n- Ne cliquez jamais sur un lien inconnu ou ne téléchargez pas de fichiers suspects.\n- Les hackers utilisent souvent ces méthodes pour voler vos infos."
        };

        // Fusionner tous les détails en un seul message
        let fullGuide = "🔐 **Guide OPSEC (Operational Security)**\n\n";
        for (const key in details) {
            fullGuide += details[key] + "\n\n";
        }

        try {
            // Envoi du DM
            await interaction.user.send(fullGuide);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "✅ Guide complet envoyé en message privé !",
                    ephemeral: true
                });
            }
        } catch (error) {
            console.log("Erreur DM :", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: "❌ Je ne peux pas t'envoyer de DM. Active tes DM !",
                    ephemeral: true
                });
            }
        }
    }
});

// Messages serveur (facultatif)
client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.GuildText) {
        // Exemple : message de bienvenue sur le serveur
        // message.reply("👋 Salut ! Si tu veux plus d'infos sur l'OPSEC, fait un ticket.");
}
});

client.login(token);