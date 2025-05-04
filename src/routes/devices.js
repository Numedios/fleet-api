import { Router } from 'express';
import { all, run } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const devices = await all('SELECT * FROM devices');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching devices' });
  }
});

router.get('/owner/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  try {
    const devices = await all('SELECT * FROM devices WHERE owner_id = ?', [ownerId]);
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching devices for employee' });
  }
});

router.post('/', async (req, res) => {
  const { device_name, type, owner_id } = req.body;
  try {
    const result = await run('INSERT INTO devices (device_name, type, owner_id) VALUES (?, ?, ?)', [device_name, type, owner_id]);
    res.status(201).json({ id: result.id, device_name, type, owner_id });
  } catch (error) {
    res.status(500).json({ error: 'Error adding device' });
  }
});

router.patch('/:id', async (req, res) => {
  const { device_name, type, owner_id } = req.body;
  const { id } = req.params;
  try {
    await run('UPDATE devices SET device_name = ?, type = ?, owner_id = ? WHERE id = ?', [device_name, type, owner_id, id]);
    res.json({ id, device_name, type, owner_id });
  } catch (error) {
    res.status(500).json({ error: 'Error updating device' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await run('DELETE FROM devices WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting device' });
  }
});

export default router;
