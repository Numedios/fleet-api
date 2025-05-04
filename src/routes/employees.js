import { Router } from 'express';
import { all, run } from '../db.js'; 

const router = Router();

router.get('/', async (req, res) => {
  try {
    const employees = await all('SELECT * FROM employees');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

router.post('/', async (req, res) => {
  const { name, role } = req.body;
  try {
    const result = await run('INSERT INTO employees (name, role) VALUES (?, ?)', [name, role]);
    res.status(201).json({ id: result.id, name, role });
  } catch (error) {
    res.status(500).json({ error: 'Error adding employee' });
  }
});

router.patch('/:id', async (req, res) => {
  const { name, role } = req.body;
  const { id } = req.params;
  try {
    await run('UPDATE employees SET name = ?, role = ? WHERE id = ?', [name, role, id]);
    res.json({ id, name, role });
  } catch (error) {
    res.status(500).json({ error: 'Error updating employee' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await run('DELETE FROM employees WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
});

export default router;
