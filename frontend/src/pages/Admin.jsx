import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [form, setForm] = useState({ title: '', description: '', technologies: '', github: '', demo: '', images: '' });
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', bio: '', photo: '', email: '', linkedin: '', github: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [projectImagePreview, setProjectImagePreview] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, photo: res.data.url });
      setPhotoPreview(URL.createObjectURL(file));
      setUploading(false);
    } catch {
      setProfileMsg('Error uploading photo.');
      setUploading(false);
    }
  };

  const handleProjectImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setProjectImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/projects/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, images: f.images ? f.images + ',' + res.data.url : res.data.url }));
      setProjectImagePreview(URL.createObjectURL(file));
      setProjectImageUploading(false);
    } catch {
      setMessage('Error uploading project image.');
      setProjectImageUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/projects', {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()),
        images: form.images.split(',').map(i => i.trim())
      });
      setMessage('Project added!');
      setForm({ title: '', description: '', technologies: '', github: '', demo: '', images: '' });
      setProjectImagePreview('');
    } catch {
      setMessage('Error adding project.');
    }
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/profile', profile);
      setProfileMsg('Profile updated!');
    } catch {
      setProfileMsg('Error updating profile.');
    }
  };

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      {/* Profile Image Section */}
      <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mb-8">
        <h3 className="font-semibold text-lg mb-2 border-b pb-2">Profile Image & Info</h3>
        <input name="name" value={profile.name} onChange={handleProfileChange} placeholder="Name" className="w-full p-2 rounded border" required />
        <textarea name="bio" value={profile.bio} onChange={handleProfileChange} placeholder="Bio" className="w-full p-2 rounded border" required rows={2} />
        <div className="mb-2">
          <label className="block font-medium mb-1">Profile Image</label>
          <input name="photo" value={profile.photo} onChange={handleProfileChange} placeholder="Photo URL" className="w-full p-2 rounded border mb-2" />
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full p-2 rounded border" />
          {uploading && <div>Uploading...</div>}
          {(photoPreview || profile.photo) && (
            <img src={photoPreview || (profile.photo ? import.meta.env.VITE_API_URL + profile.photo : '')} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto mb-2" />
          )}
        </div>
        <input name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" className="w-full p-2 rounded border" />
        <input name="phone" value={profile.phone || ''} onChange={handleProfileChange} placeholder="Mobile Number" className="w-full p-2 rounded border" />
        <input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} placeholder="LinkedIn URL" className="w-full p-2 rounded border" />
        <input name="github" value={profile.github} onChange={handleProfileChange} placeholder="GitHub URL" className="w-full p-2 rounded border" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update Profile</button>
        {profileMsg && <div className="text-center mt-2">{profileMsg}</div>}
      </form>

      {/* Project Images Section */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mb-8">
        <h3 className="font-semibold text-lg mb-2 border-b pb-2">Add Project & Images</h3>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded border" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded border" required rows={2} />
        <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated)" className="w-full p-2 rounded border" />
        <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub Link" className="w-full p-2 rounded border" />
        <input name="demo" value={form.demo} onChange={handleChange} placeholder="Live Demo Link" className="w-full p-2 rounded border" />
        <input name="images" value={form.images} onChange={handleChange} placeholder="Image URLs (comma separated)" className="w-full p-2 rounded border" />
        <input type="file" accept="image/*" onChange={handleProjectImageChange} className="w-full p-2 rounded border" />
        {projectImageUploading && <div>Uploading project image...</div>}
        {projectImagePreview && (
          <img src={projectImagePreview} alt="Project Preview" className="w-24 h-24 rounded mx-auto mb-2" />
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Project</button>
        {message && <div className="text-center mt-2">{message}</div>}
      </form>
    </section>
  );
}

export default Admin; 