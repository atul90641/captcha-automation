import React, { useState, useEffect, useRef } from 'react';
import supabase from './supabaseClient';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const canvasRef = useRef(null);

  // Function to generate a random 6-digit CAPTCHA
  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
    setCaptcha(randomCaptcha);
  };

  // Function to draw CAPTCHA on canvas
  const drawCaptcha = (captchaText) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous CAPTCHA

    // Customize CAPTCHA appearance
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(captchaText, 20, 30); // Draw CAPTCHA text
  };

  // Run on component mount to generate the initial CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Draw CAPTCHA on canvas after it's generated
  useEffect(() => {
    if (captcha) {
      drawCaptcha(captcha);
    }
  }, [captcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userCaptchaInput !== captcha) {
      setError('CAPTCHA does not match. Please try again.');
      return;
    }

    try {
      // Insert username and password into Supabase `users` table
      const { data, error } = await supabase
        .from('users')
        .insert([{ username: username, password: password }]);

      if (error) {
        setError(error.message);
        setSuccess('');
      } else {
        setSuccess('User added successfully!');
        setError('');
        setUsername('');
        setPassword('');
        setUserCaptchaInput('');
        generateCaptcha(); // Regenerate CAPTCHA after successful form submission
      }
    } catch (err) {
      setError('Failed to add user.');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* CAPTCHA Canvas */}
      <div>
        <label>CAPTCHA:</label>
        <canvas ref={canvasRef} width="150" height="50" className="captchaCanvas"></canvas>
        <input
          type="text"
          placeholder="Enter CAPTCHA"
          value={userCaptchaInput}
          onChange={(e) => setUserCaptchaInput(e.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}

export default LoginForm;
