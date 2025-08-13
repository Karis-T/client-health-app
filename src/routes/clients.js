const express = require('express');
const router = express.Router();
const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} = require('../models/clients');

// GET select all clients
router.get('/', async (_, response) => {
    try {
        response.json(await getAllClients());
    } catch {
        response.status(500).json({ error: 'Failed to load client list'});
    }
});

// GET select a client by id
router.get('/:id', async (request, response) => {
    try {
        const row = await getClientById(Number(request.params.id));
        if (!row) return response.status(404).json({ error: 'Client Not found' });
        response.json(row);
    } catch {
        response.status(500).json({ error: 'Failed to load client'});
    }
});

// POST create a new client
router.post('/', async (request, response) => {
    try {
        response.status(201).json(await createClient(request.body));
    } catch {
        response.status(400).json({ error: 'Invalid payload'});
    }
});

// PUT update a client
router.put('/:id', async (request, response) => {
    try {
        response.json(await updateClient(Number(request.params.id), request.body));
    } catch {
        response.status(400).json({ error: 'Invalid payload'});
    }
});

// DELETE delete a client
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteClient(id);
    if (!result.affected) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;