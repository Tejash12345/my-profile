import Skills from '../models/Skills.js';

const validTypes = ['frontend', 'backend', 'Developer Tools', 'Technologies/Frameworks/Database'];

// Ensure a single skills document exists
async function getOrCreateSkills() {
  let skills = await Skills.findOne();
  if (!skills) skills = await Skills.create({ frontend: [], backend: [], 'Developer Tools': [], 'Technologies/Frameworks/Database': [] });
  return skills;
}

// GET /skills
export const getSkills = async (req, res) => {
  try {
    const skills = await getOrCreateSkills();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

// POST /skills { type, name }
export const addSkill = async (req, res) => {
  try {
    const { type, name } = req.body;
    if (!validTypes.includes(type) || !name) return res.status(400).json({ error: 'Invalid skill data' });
    const skills = await getOrCreateSkills();
    if (!skills[type].includes(name)) skills[type].push(name);
    await skills.save();
    res.json(skills);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add skill' });
  }
};

// DELETE /skills/:type/:name
export const removeSkill = async (req, res) => {
  try {
    const { type, name } = req.params;
    if (!validTypes.includes(type) || !name) return res.status(400).json({ error: 'Invalid skill data' });
    const skills = await getOrCreateSkills();
    skills[type] = skills[type].filter(skill => skill !== name);
    await skills.save();
    res.json(skills);
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove skill' });
  }
}; 