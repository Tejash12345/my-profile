import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="text-center text-gray-400">All projects are now displayed on the Home page.</div>
    </section>
  );
}

export default Projects; 