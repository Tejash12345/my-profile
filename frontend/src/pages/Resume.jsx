import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeMsg, setResumeMsg] = useState('');

  const fetchResume = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/profile/resume/pdf', { responseType: 'blob' });
      if (res.data) {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setResumeUrl(url);
      }
    } catch {
      setResumeUrl('');
    }
  };

  const handleResumeChange = async e => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setResumeMsg('Please upload a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/profile/resume/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeMsg('Resume PDF uploaded!');
      fetchResume();
    } catch {
      setResumeMsg('Error uploading resume PDF.');
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Resume</h2>
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
        <input type="file" accept=".pdf" onChange={handleResumeChange} className="mb-4 text-white" />
        {resumeMsg && <div className="mb-4 text-center text-green-400">{resumeMsg}</div>}
        {resumeUrl ? (
          <div className="flex flex-col items-center">
            <a
              href={resumeUrl}
              download="resume.pdf"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Download Resume (PDF)
            </a>
          </div>
        ) : (
          <div className="text-gray-400">No resume PDF uploaded yet.</div>
        )}
      </div>
    </section>
  );
};

export default Resume; 