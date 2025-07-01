import Project from '../models/Project.js';

// GET /projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const projectsWithImages = projects.map(p => ({
      ...p.toObject(),
      imageBase64: p.imageData
        ? `data:${p.imageType};base64,${p.imageData.toString('base64')}`
        : null
    }));
    res.json(projectsWithImages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// POST /projects (admin only)
export const addProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add project' });
  }
};

// DELETE /projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 