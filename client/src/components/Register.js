import React, { useState } from 'react';
import { register, updateProfile } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../style/register.scss';

const Register = ({ setUserData, setProfileData }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [businessData, setBusinessData] = useState({
    restaurantName: '',
    ownerName: '',
    profilePicture: null
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setBusinessData({ ...businessData, [name]: files[0] });
    } else if (isRegistered) {
      setBusinessData({ ...businessData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistered) {
      if (formData.username && formData.email && formData.password) {
        try {
          const response = await register(formData);
          setMessage('Successfully registered!');
          setIsRegistered(true);
          setUserId(response.data.user._id); 
          setUserData(response.data);
          setIsRegistered(true);
          console.log('User registered:', response.data);
          console.log(isRegistered);
        } catch (error) {
          setMessage('Registration error');
          console.error('Registration error:', error);
        }
      } else {
        setMessage('Please fill out all fields');
      }
    }
    if(isRegistered) {
      console.log("entering profile data")
      if (businessData.restaurantName && businessData.ownerName && businessData.profilePicture) {
        try {
          console.log("ID: ");
          console.log(formData);
          const profileData = {
            userId: userId,
            restaurantName: businessData.restaurantName,
            ownerName: businessData.ownerName,
            profilePicture: businessData.profilePicture 
          };

          console.log("==profile data: ");
          console.log(profileData)
          const response = await updateProfile(profileData);
          console.log(response);
          setBusinessData(profileData);
          setProfileData(profileData);
          setMessage('Business details saved successfully!');
          setTimeout(() => navigate('/'), 2000); 
        } catch (error) {
          setMessage('Error updating profile');
          console.error('Profile update error:', error);
        }
      } else {
        setMessage('Please fill out all fields');
      }
    }
  };

  return (
    <div className="register-container">
      <h1>FloatPOS</h1>
      <img src="/placeholder-logo.png" alt="Logo" className="logo"/>
      {!isRegistered ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
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
          <button type="submit">Register</button>
          {message && <p>{message}</p>}
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="restaurantName"
            placeholder="Restaurant Name"
            value={businessData.restaurantName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={businessData.ownerName}
            onChange={handleChange}
          />
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Done</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default Register;
