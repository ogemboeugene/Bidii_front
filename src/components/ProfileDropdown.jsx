import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Ensure axios is installed
import './css/ProfileDropdown.css'; // Import CSS for styling

const ProfileDropdown = ({
  profileImageSrc = '',
  onLogout = () => {} // Default to empty function to allow custom overrides
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    role: '',
    active: false
  });

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios.get(`${apiUrl}/user_info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      setUserInfo({
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        active: response.data.active
      });
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
  }, [apiUrl]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 200) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      } else {
        console.error('Unexpected response:', response);
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const goToSettings = () => {
    navigate('/settings'); // Navigate to the /settings page
  };

  const goToSignup = () => {
    navigate('/signup'); // Navigate to the /signup page
  };

  return (
    <div className="profile-dropdown-container">
      <div className="profile-avatar" onClick={toggleDropdown}>
        {profileImageSrc ? (
          <img className="profile-avatar-image" alt="Profile avatar" src={profileImageSrc} />
        ) : (
          <FontAwesomeIcon icon={faUser} className="profile-avatar-placeholder" />
        )}
      </div>
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            {profileImageSrc ? (
              <img src={profileImageSrc} alt="Profile" className="profile-picture" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="profile-picture" />
            )}
            <div className="profile-info">
              <h4 className="profile-username">{userInfo.username}</h4>
              <p className="profile-email">{userInfo.email}</p>
              <p className="profile-role">{userInfo.role}</p>
            </div>
          </div>
          <div className="profile-dropdown-options">
            {userInfo.role === 'admin' && (
              <button className="profile-option" onClick={goToSignup}>
                <FontAwesomeIcon icon={faPlus} className="profile-option-icon" />
                Create User
              </button>
            )}
            <button className="profile-option" onClick={goToSettings}>
              <FontAwesomeIcon icon={faCog} className="profile-option-icon" />
              Settings
            </button>
            <button className="profile-option" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="profile-option-icon" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
