// index.js — le point d'entrée du serveur backend
// C'est ce fichier qui démarre quand Railway lance l'application.

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db');

const app = express();

// Permet au frontend (votre site) d'appeler ce backend depuis un autre
// domaine. Sans ça, le navigateur bloquerait les requêtes par sécurité.
app.use(cors());

// Permet de lire le JSON envoyé par le frontend (ex: les données d'un
// formulaire de réservation).
app.use(express.json());

// Une toute première route, juste pour vérifier que le serveur tourne.
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Cabinet Dentaire Salem actif' });
});

// Railway fournit le port à utiliser via une variable d'environnement.
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  try {
    await initDb();
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données :', err.message);
  }
});
