import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [profile, setProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeMsg, setResumeMsg] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/profile')
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
    // Fetch latest resume PDF
    axios.get(import.meta.env.VITE_API_URL + '/profile/resume/pdf', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setResumeUrl(url);
      })
      .catch(() => setResumeUrl(''));
    // Fetch projects for preview
    axios.get(import.meta.env.VITE_API_URL + '/projects')
      .then(res => setProjects(res.data))
      .catch(() => setProjects([]));
  }, []);

  const handleDownloadResumePDF = async () => {
    setDownloading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/profile/resume/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch {
      alert('Failed to download resume PDF.');
    } finally {
      setDownloading(false);
    }
  };

  // Add image upload handler for Home page
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
      const updated = await axios.get(import.meta.env.VITE_API_URL + '/projects');
      setProjects(updated.data);
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploadingId(null);
      if (fileInputs.current[projectId]) fileInputs.current[projectId].value = '';
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {profile && profile.photo && (
          <img
            src={import.meta.env.VITE_API_URL + profile.photo}
            alt="Profile"
            className="rounded-full w-32 h-32 mb-6 border-4 border-primary-500 shadow-lg"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{profile ? profile.name : 'Welcome to My Portfolio'}</h1>
        <p className="text-lg max-w-xl mb-4">
          {profile ? profile.bio : "Hi! I'm a passionate MERN stack developer. Explore my projects, skills, and get in touch!"}
        </p>
        {/* Only show the blue download button for PDF */}
        <button
          onClick={handleDownloadResumePDF}
          disabled={downloading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          {downloading ? 'Downloading...' : 'Download Resume (PDF)'}
        </button>
        {profile && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex gap-8 justify-center">
              {profile.github && (
                <div className="flex flex-col items-center">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600" aria-label="GitHub">
                    <svg className="w-7 h-7 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                  </a>
                  <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">GitHub</span>
                </div>
              )}
              {profile.linkedin && (
                <div className="flex flex-col items-center">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600" aria-label="LinkedIn">
                    <svg className="w-7 h-7 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z"/></svg>
                  </a>
                  <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">LinkedIn</span>
                </div>
              )}
              {profile.email && (
                <div className="flex flex-col items-center">
                  <a href={`mailto:${profile.email}`} className="hover:text-blue-600" aria-label="Email">
                    <svg className="w-7 h-7 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-9.99l7.99 7.99c.39.39 1.02.39 1.41 0L20 10.01V20H4z"/></svg>
                  </a>
                  <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">Email</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <a href={`tel:${profile.phone}`} className="hover:text-blue-600 flex items-center" aria-label="Phone">
                    <svg className="w-7 h-7 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"/></svg>
                    <span className="text-xs ml-1 text-gray-700 dark:text-gray-300">{profile.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      {/* All Projects Section */}
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
                        <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 mb-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                        </svg>
                        <span className="text-xs text-blue-300">GitHub</span>
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                        <span className="text-3xl mb-1">🌐</span>
                        <span className="text-xs text-green-300">Live Demo</span>
                      </a>
                    )}
                  </div>
                  <div className="flex justify-center mt-4">
                    {/* Delete button removed */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Home; 