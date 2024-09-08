import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import './css/ForgotPasswordPage.css'; // Import CSS for styling

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_BASE_URL; // Ensure this environment variable is set
  const frontendBaseUrl = window.location.origin; // Get the base URL of the current frontend

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/forgot_password`, { 
        identifier: email,
        frontend_base_url: frontendBaseUrl // Send the frontend base URL to the backend
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Forgot Password</h1>
        {error && <div className="error-banner">{error}</div>}
        {message && <div className="success-banner">{message}</div>}
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Password Reset Link'}
          </button>
        </form>
        <div className="links">
          <p className="link"><a href="/login" className="link">Back to Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
