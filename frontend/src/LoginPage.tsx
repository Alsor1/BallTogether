/** Clasa pentru gestionarea autentificarii si inregistrarii utilizatorilor
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email.includes('@')) return "Please enter a valid email address.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (!isLogin && formData.password !== formData.confirmPassword) return "Passwords do not match.";
    if (!isLogin && !formData.fullName) return "Full name is required for registration.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifică potrivirea parolelor în frontend
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const payload = {
      fullName: formData.fullName,  // Trebuie să fie "fullName" (camelCase)
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert("Account created! Please login.");
        // Comută la ecranul de login
        setIsLogin(true);
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      } else {
        const errorMsg = await response.text();
        setError("Error: " + errorMsg);
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { 
      email: formData.email, 
      password: formData.password 
    };

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();
        // Salvează atât email-ul cât și ID-ul userului
        localStorage.setItem('user', formData.email);
        localStorage.setItem('userId', userData.id.toString());
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.fullName || userData.name);
        navigate('/dashboard');
      } else {
        const msg = await response.text();
        setError(msg || "Authentication failed.");
      }
    } catch (err) {
      setError("Could not connect to the server.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleRegister(e);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter your details to get back on the court' : 'Join the community and start playing'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-msg">{error}</div>}

          {!isLogin && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <input 
                type="text" name="fullName" placeholder="John Doe"
                value={formData.fullName} onChange={handleInputChange} 
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input 
              type="email" name="email" placeholder="email@example.com"
              value={formData.email} onChange={handleInputChange} required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input 
              type="password" name="password" placeholder="••••••••"
              value={formData.password} onChange={handleInputChange} required
            />
          </div>

          {!isLogin && (
            <div className="auth-input-group">
              <label>Confirm Password</label>
              <input 
                type="password" name="confirmPassword" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleInputChange} required
              />
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;