import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    github: '',
    demo: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef();
  const fileInputs = useRef({});
  const [imageUrlInput, setImageUrlInput] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    axios.get(import.meta.env.VITE_API_URL + '/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setDeleting(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete project.');
    } finally {
      setDeleting(null);
    }
  };

  const handleImageChange = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(projectId);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await axios.post(import.meta.env.VITE_API_URL + '/projects/image', data);
      const imageUrl = res.data.url;
      // Update project with new image
      await axios.patch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, { image: imageUrl });
      // Refresh projects
      fetchProjects();
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploadingId(null);
      if (fileInputs.current[projectId]) fileInputs.current[projectId].value = '';
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setAdding(true);
    let image = form.imageUrl;
    try {
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);
        const res = await axios.post(import.meta.env.VITE_API_URL + '/projects/image', data);
        image = res.data.url;
      }
      const newProject = {
        title: form.title,
        description: form.description,
        technologies: form.technologies.split(',').map(t => t.trim()),
        github: form.github,
        demo: form.demo,
        image
      };
      const res = await axios.post(import.meta.env.VITE_API_URL + '/projects', newProject);
      setProjects([res.data, ...projects]);
      setForm({ title: '', description: '', technologies: '', github: '', demo: '', imageUrl: '' });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert('Failed to add project.');
    } finally {
      setAdding(false);
    }
  };

  const handleImageUpload = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    await axios.post(`${import.meta.env.VITE_API_URL}/projects/${projectId}/image`, data);
    fetchProjects(); // Refresh the list
  };

  const handleImageUrlChange = (e, projectId) => {
    setImageUrlInput(prev => ({ ...prev, [projectId]: e.target.value }));
  };

  const handleSetImageUrl = async (projectId) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, { imageUrl: imageUrlInput[projectId] });
    fetchProjects();
    setImageUrlInput(prev => ({ ...prev, [projectId]: '' }));
  };

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">Projects</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map(project => {
          const displayImage = project.imageBase64 || project.imageUrl;
          return (
            <div
              key={project._id}
              className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl border border-gray-800 relative"
            >
              {displayImage && (
                <img
                  src={displayImage}
                  alt={project.title}
                  className="w-full h-56 object-cover rounded-t-xl"
                  style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                <p className="mb-2 text-gray-300">{project.description}</p>
                <div className="mb-2">
                  <span className="font-semibold text-gray-400">Technologies:</span> <span className="text-gray-200">{project.technologies?.join(', ')}</span>
                </div>
                <div className="flex gap-8 mt-2 mb-4 justify-center">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                      {/* GitHub Icon */}
                      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                      </svg>
                      <span className="text-xs text-blue-300">GitHub</span>
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                      {/* Live Demo Icon */}
                      <span className="text-3xl mb-1">🌐</span>
                      <span className="text-xs text-green-300">Live Demo</span>
                    </a>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deleting === project._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm shadow focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                  >
                    {deleting === project._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects; 