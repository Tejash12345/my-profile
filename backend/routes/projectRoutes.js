import express from 'express';
import { getProjects, addProject, deleteProject, getProjectById, updateProject } from '../controllers/projectController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Project from '../models/Project.js';

const router = express.Router();

// Set up multer for local storage
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', getProjects);
router.post('/', addProject); // For admin use

// New: Upload project image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

router.delete('/:id', deleteProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);

router.post('/:id/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.imageData = req.file.buffer;
  project.imageType = req.file.mimetype;
  await project.save();
  res.json({ message: 'Image uploaded' });
});

export default router; 