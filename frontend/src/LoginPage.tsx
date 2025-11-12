import React, { useState } from 'react';
import './App.css';

const LoginPage: React.FC = () => {
  // 1. State to toggle between Login and Register
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 2. State to hold form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // 3. Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 4. Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent page reload
  
      if (isLoginMode) {
        // --- LOGIN LOGIC ---
        try {
          const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              username: formData.username, 
              password: formData.password 
            }),
          });
  
          if (response.ok) {
            alert("Login Successful! Welcome back.");
            // Redirect logic usually goes here (e.g., navigate('/dashboard'))
          } else {
            alert("Login Failed: Invalid credentials");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Could not connect to server.");
        }
      } else {
        // --- REGISTER LOGIC ---
        try {
          const response = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
  
          if (response.ok) {
            alert("Registration Successful! Please Login.");
            setIsLoginMode(true); // Switch back to login mode
          } else {
            const errorMsg = await response.text();
            alert("Registration Failed: " + errorMsg);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Could not connect to server.");
        }
      }
    };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>{isLoginMode ? 'Player Login' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Username - Always visible */}
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required 
          />

          {/* Email - Only visible in Register Mode */}
          {!isLoginMode && (
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          )}

          {/* Password - Always visible */}
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />

          {/* Submit Button */}
          <button type="submit" className="login-btn" style={{ width: '100%', marginTop: '10px' }}>
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Link */}
        <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          {isLoginMode ? (
            <span>
              New to the court?{' '}
              <span 
                onClick={() => setIsLoginMode(false)} 
                style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}>
                Register here
              </span>
            </span>
          ) : (
            <span>
              Already have a squad?{' '}
              <span 
                onClick={() => setIsLoginMode(true)} 
                style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}>
                Login here
              </span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;