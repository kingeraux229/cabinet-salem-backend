// routes/rendezvous.js — routes liées aux rendez-vous des patients
// Ce fichier définit 3 routes :
//   POST   /api/rendezvous              → créer un nouveau RDV
//   GET    /api/rendezvous?telephone=.. → retrouver les RDV d'un patient
//   DELETE /api/rendezvous/:id          → annuler un RDV

const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Génère un code de confirmation simple à 6 caractères (ex: "A1B2C3")
function genererCodeConfirmation() {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I pour éviter la confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return code;
}

// POST /api/rendezvous — créer un nouveau rendez-vous
router.post('/', async (req, res) => {
  try {
    const { nom, telephone, service, date, heure } = req.body;

    // Vérification simple que les champs essentiels sont bien présents
    if (!nom || !telephone || !service || !date || !heure) {
      return res.status(400).json({
        erreur: 'Champs manquants. Merci de fournir : nom, telephone, service, date, heure.',
      });
    }

    const codeConfirmation = genererCodeConfirmation();

    const resultat = await pool.query(
      `INSERT INTO rendezvous (nom, telephone, service, date, heure, statut, code_confirmation)
       VALUES ($1, $2, $3, $4, $5, 'confirme', $6)
       RETURNING *`,
      [nom, telephone, service, date, heure, codeConfirmation]
    );

    res.status(201).json({
      message: 'Rendez-vous créé avec succès.',
      rendezvous: resultat.rows[0],
    });
  } catch (err) {
    console.error('Erreur lors de la création du rendez-vous :', err.message);
    res.status(500).json({ erreur: 'Une erreur est survenue lors de la création du rendez-vous.' });
  }
});

// GET /api/rendezvous?telephone=... — retrouver les RDV d'un patient par son numéro
router.get('/', async (req, res) => {
  try {
    const { telephone } = req.query;

    if (!telephone) {
      return res.status(400).json({ erreur: 'Le paramètre telephone est requis.' });
    }

    const resultat = await pool.query(
      `SELECT * FROM rendezvous WHERE telephone = $1 ORDER BY date ASC, heure ASC`,
      [telephone]
    );

    res.json({ rendezvous: resultat.rows });
  } catch (err) {
    console.error('Erreur lors de la recherche des rendez-vous :', err.message);
    res.status(500).json({ erreur: 'Une erreur est survenue lors de la recherche des rendez-vous.' });
  }
});

// DELETE /api/rendezvous/:id — annuler un rendez-vous
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultat = await pool.query(
      `UPDATE rendezvous SET statut = 'annule' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (resultat.rows.length === 0) {
      return res.status(404).json({ erreur: 'Rendez-vous introuvable.' });
    }

    res.json({ message: 'Rendez-vous annulé.', rendezvous: resultat.rows[0] });
  } catch (err) {
    console.error('Erreur lors de l\'annulation du rendez-vous :', err.message);
    res.status(500).json({ erreur: 'Une erreur est survenue lors de l\'annulation du rendez-vous.' });
  }
});

module.exports = router;
