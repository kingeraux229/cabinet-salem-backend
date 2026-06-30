// index.js — le point d'entrée du serveur backend
// C'est ce fichier qui démarre quand Railway lance l'application.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Permet au frontend (votre site) d'appeler ce backend depuis un autre
// domaine. Sans ça, le navigateur bloquerait les requêtes par sécurité.
app.use(cors());

// Permet de lire le JSON envoyé par le frontend (ex: les données d'un
// formulaire de réservation).
app.use(express.json());

// Une toute première route, juste pour vérifier que le serveur tourne.
// Quand on ouvrira l'URL du backend dans un navigateur, on doit voir ce
// message.
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Cabinet Dentaire Salem actif' });
});

// Railway fournit le port à utiliser via une variable d'environnement.
// En local ce serait le port 3000, mais Railway choisit lui-même le port
// réel — d'où process.env.PORT.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
