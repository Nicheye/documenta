import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientIP, setClientIP] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    // Fetch client's IP address from a third-party service
    const fetchClientIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setClientIP(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchClientIP();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
	console.log(clientIP)
    const user = {
      username: username,
      password: password,
      ip_adress: String(clientIP),
      email:email // Include client's IP address in the request payload
    };

    try {
      await axios.post('http://127.0.0.1:8000/register/', user);
      console.log('Registration successful');
	  window.location.href='/login'
      // Redirect or show success message
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration failure
    }
  };

  return (
    <>
      <div className="auth-login">
        <div className="access-banner">Personal Access</div>

        <div className="auth_form">
          <div className="auth-title">Register</div>
          <form action="" className="auth_inputs" onSubmit={submit}>
            <input
              className="auth_input"
              placeholder="Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              name="password"
              type="password"
              className="auth_input"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

          <input
              name="email"
              type="email"
              className="auth_input"
              placeholder="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="auth-btn">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
