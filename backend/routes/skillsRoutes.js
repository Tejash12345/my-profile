import express from 'express';
import { getSkills, addSkill, removeSkill } from '../controllers/skillsController.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', addSkill);
router.delete('/:type/:name', removeSkill);

export default router; 