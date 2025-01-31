import React, { useState } from 'react';
import axios from 'axios';
import "./ImageLoader.css";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      setMessage('Please select a file and enter your email.');
      return;
    }

    try {
      const filename = encodeURIComponent(file.name);
      const contentType = file.type;

      // Send POST request to API Gateway
      const response = await axios.post(
        'https://zzvz8ogq5f.execute-api.us-east-1.amazonaws.com/Test/upload',
        { filename, contentType, email }
      );

      const { uploadURL } = response.data;
      console.log(uploadURL, response.data);
      // Upload the file to S3 using the pre-signed URL
      await axios.put(uploadURL, file, {
        headers: { 'Content-Type': file.type },
      });

      setMessage('Upload successful!');


    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div class="upload-container">
      <h2>Upload Image</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        class="input-field"
      />
      <input type="file" onChange={handleFileChange} class="file-input"/>
      <button onClick={handleUpload} class="upload-button">Upload</button>
      <p class="message">{message}</p>
    </div>
  );
};

export default ImageUploader;
