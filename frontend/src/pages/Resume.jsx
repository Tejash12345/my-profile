import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Resume = () => {
  const [resumeImageUrl, setResumeImageUrl] = useState('');
  const [resumeImageMsg, setResumeImageMsg] = useState('');

  const fetchResumeImage = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/profile/resume/image', { responseType: 'blob' });
      if (res.data) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        setResumeImageUrl(url);
      }
    } catch {
      setResumeImageUrl('');
    }
  };

  const handleResumeImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/profile/resume/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeImageMsg('Resume image uploaded!');
      fetchResumeImage();
    } catch {
      setResumeImageMsg('Error uploading resume image.');
    }
  };

  useEffect(() => {
    fetchResumeImage();
  }, []);

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Resume</h2>
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
        <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleResumeImageChange} className="mb-4 text-white" />
        {resumeImageMsg && <div className="mb-4 text-center text-green-400">{resumeImageMsg}</div>}
        {resumeImageUrl ? (
          <div className="flex flex-col items-center">
            <img src={resumeImageUrl} alt="Resume" className="mx-auto mb-2 max-h-96 rounded shadow" />
            <a
              href={resumeImageUrl}
              download="resume-image.jpg"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Download Resume
            </a>
          </div>
        ) : (
          <div className="text-gray-400">No resume image uploaded yet.</div>
        )}
      </div>
    </section>
  );
};

export default Resume; 