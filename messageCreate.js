client.on("messageCreate", async message => {
    if (message.author.bot) return;

    // 🔹 DM uniquement
    if (message.channel.type === ChannelType.DM) {
        const reply = message.content.trim();

        const details = {
            "1": "1️⃣ Ne jamais partager d'informations personnelles :\nNe divulguez jamais votre vrai nom, adresse, téléphone ou autres informations sensibles en ligne.",
            "2": "2️⃣ Utiliser des mots de passe forts :\nUtilisez des mots de passe uniques, longs, avec majuscules, chiffres et symboles. Un gestionnaire de mots de passe peut aider.",
            "3": "3️⃣ Activer la double authentification :\nAjoutez une couche de sécurité supplémentaire à vos comptes importants pour éviter les accès non autorisés.",
            "4": "4️⃣ Utiliser un VPN sur les réseaux publics :\nLe VPN chiffre votre connexion sur les réseaux Wi-Fi publics, protégeant vos données contre les espions.",
            "5": "5️⃣ Faire attention aux liens et fichiers suspects :\nNe cliquez jamais sur un lien inconnu ou ne téléchargez pas de fichiers suspects. Les hackers utilisent souvent ces méthodes pour voler vos infos."
        };

        if (details[reply]) {
            await message.reply(details[reply]);
        } else {
            await message.reply("❓ Je n'ai pas compris. Réponds avec un chiffre de 1 à 5 pour plus de détails.");
        }

        return; // 🔹 On ne passe pas à la suite
    }

    // 🔹 Messages serveur
    if (message.channel.type === ChannelType.GuildText) {
        // message.reply("👋 Salut ! Si tu veux plus d'infos sur l'OPSEC, pose ta question ici.");
    }
});