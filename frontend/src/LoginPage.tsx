import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isLoginMode 
      ? 'http://localhost:8080/api/users/login' 
      : 'http://localhost:8080/api/users/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (isLoginMode) {
          // --- LOGIN SUCCESS ---
          const successMsg = await response.text();
          console.log(successMsg); // "Login successful"
          
          // Save username to LocalStorage so we remember who is logged in
          localStorage.setItem('user', formData.username);
          
          // Redirect to the main app/dashboard
          navigate('/dashboard'); 
        } else {
          // --- REGISTER SUCCESS ---
          alert("Registration Successful! Please Login.");
          setIsLoginMode(true); 
        }
      } else {
        // --- FAILURE ---
        const errorMsg = await response.text();
        alert("Error: " + errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>{isLoginMode ? 'Player Login' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit}>
          
          <input 
            type="text" 
            name="username"
            placeholder="Username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required 
          />

          {!isLoginMode && (
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          )}

          <input 
            type="password" 
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required 
          />

          <button type="submit" className="login-btn" style={{ width: '100%', marginTop: '10px' }}>
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          {isLoginMode ? (
            <span>New to the court? <span onClick={() => setIsLoginMode(false)} style={{ color: '#61dafb', cursor: 'pointer', fontWeight: 'bold' }}>Register here</span></span>
          ) : (
            <span>Already have a squad? <span onClick={() => setIsLoginMode(true)} style={{ color: '#61dafb', cursor: 'pointer', fontWeight: 'bold' }}>Login here</span></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;