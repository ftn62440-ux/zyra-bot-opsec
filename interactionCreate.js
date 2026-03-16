client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "opsec_button") {
    try {
      // DM avec tous les détails directement
      await interaction.user.send(`
🔐 **Guide OPSEC (Operational Security)**

1️⃣ **Ne jamais partager d'informations personnelles**
   - Ne divulguez jamais votre vrai nom, adresse, téléphone ou autres informations sensibles en ligne.

2️⃣ **Utiliser des mots de passe forts**
   - Utilisez des mots de passe uniques, longs, avec majuscules, chiffres et symboles.
   - Un gestionnaire de mots de passe peut aider.

3️⃣ **Activer la double authentification**
   - Ajoutez une couche de sécurité supplémentaire à vos comptes importants pour éviter les accès non autorisés.

4️⃣ **Utiliser un VPN sur les réseaux publics**
   - Le VPN chiffre votre connexion sur les réseaux Wi-Fi publics, protégeant vos données contre les espions.

5️⃣ **Faire attention aux liens et fichiers suspects**
   - Ne cliquez jamais sur un lien inconnu ou ne téléchargez pas de fichiers suspects.
   - Les hackers utilisent souvent ces méthodes pour voler vos infos.
      `);

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