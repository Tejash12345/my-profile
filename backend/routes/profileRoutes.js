import express from 'express';
import { getProfile, upsertProfile } from '../controllers/profileController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set up multer for local storage
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', getProfile);
router.post('/', upsertProfile);

// Upload profile photo
router.post('/photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Upload resume
router.post('/resume/upload', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Optionally, you could store the filename in the profile document
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Upload resume image
router.post('/resume/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Upload PDF resume
router.post('/resume/pdf', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (path.extname(req.file.originalname).toLowerCase() !== '.pdf') {
    // Remove the uploaded non-pdf file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }
  // Optionally, rename to a fixed name (e.g., resume.pdf) or keep as is
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Serve the latest resume
router.get('/resume', (req, res) => {
  // Find the latest uploaded resume file in uploads/
  const files = fs.readdirSync(uploadDir)
    .filter(f => f.match(/\.(pdf|docx?)$/i))
    .map(f => ({ name: f, time: fs.statSync(path.join(uploadDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  if (!files.length) return res.status(404).json({ error: 'No resume found' });
  const latest = files[0].name;
  res.sendFile(path.join(uploadDir, latest));
});

// Delete the latest resume
router.delete('/resume', (req, res) => {
  const files = fs.readdirSync(uploadDir)
    .filter(f => f.match(/\.(pdf|docx?)$/i))
    .map(f => ({ name: f, time: fs.statSync(path.join(uploadDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  if (!files.length) return res.status(404).json({ error: 'No resume found' });
  const latest = files[0].name;
  fs.unlinkSync(path.join(uploadDir, latest));
  res.json({ message: 'Resume deleted' });
});

// Serve the latest resume image
router.get('/resume/image', (req, res) => {
  const files = fs.readdirSync(uploadDir)
    .filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i))
    .map(f => ({ name: f, time: fs.statSync(path.join(uploadDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  if (!files.length) return res.status(404).json({ error: 'No resume image found' });
  const latest = files[0].name;
  res.sendFile(path.join(uploadDir, latest));
});

// Serve the latest PDF resume
router.get('/resume/pdf', (req, res) => {
  const files = fs.readdirSync(uploadDir)
    .filter(f => f.match(/\.pdf$/i))
    .map(f => ({ name: f, time: fs.statSync(path.join(uploadDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  if (!files.length) return res.status(404).json({ error: 'No resume PDF found' });
  const latest = files[0].name;
  res.sendFile(path.join(uploadDir, latest));
});

export default router; 