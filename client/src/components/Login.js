import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../style/login.scss';

const Login = ({ setUserData }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        const response = await login(formData);
        localStorage.setItem('token', response.data.token);
        setUserData(response.data);
        console.log('User logged in:', response.data.user);

        navigate('/');
      } catch (error) {
        setMessage('Login error');
        console.error('Login error:', error);
      }
    } else {
      setMessage('Please fill out all fields');
    }
  };

  return (
    <div className="login-container">
      <h1>FloatPOS</h1>
      <img src="/placeholder-logo.png" alt="Logo" className="logo"/>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
