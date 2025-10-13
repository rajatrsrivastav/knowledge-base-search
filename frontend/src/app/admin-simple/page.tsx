"use client";

import React, { useState } from 'react';

function AdminPage() {
  const [faqData, setFaqData] = useState({ question: '', answer: '' });
  const [pdfData, setPdfData] = useState({ title: '', file: null as File | null });
  const [message, setMessage] = useState('');

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(apiBase + '/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData)
      });
      
      if (response.ok) {
        setMessage('FAQ added successfully!');
        setFaqData({ question: '', answer: '' });
      } else {
        setMessage('Failed to add FAQ');
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfData.file) return;
    
    const formData = new FormData();
    formData.append('title', pdfData.title);
    formData.append('file', pdfData.file);

    try {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(apiBase + '/pdfs', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setMessage('PDF uploaded successfully!');
        setPdfData({ title: '', file: null });
      } else {
        setMessage('Failed to upload PDF');
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Panel</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h2>Add FAQ</h2>
        <form onSubmit={handleFaqSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Question:</label>
            <input
              type="text"
              value={faqData.question}
              onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Answer:</label>
            <textarea
              value={faqData.answer}
              onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
              style={{
                display: 'block',
                width: '100%',
                height: '100px',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add FAQ
          </button>
        </form>
      </div>

      <div>
        <h2>Upload PDF</h2>
        <form onSubmit={handlePdfSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Title:</label>
            <input
              type="text"
              value={pdfData.title}
              onChange={(e) => setPdfData({ ...pdfData, title: e.target.value })}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>PDF File:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfData({ ...pdfData, file: e.target.files?.[0] || null })}
              style={{
                display: 'block',
                margin: '5px 0',
                padding: '8px'
              }}
              required
            />
          </div>
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Upload PDF
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;