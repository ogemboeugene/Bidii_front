import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faLock, faEnvelope, faGlobe, faPalette, faCalendarAlt, faSave, faQuestionCircle, faCog
} from '@fortawesome/free-solid-svg-icons';
import './css/Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button className={activeSection === 'account' ? 'active' : ''} onClick={() => handleSectionChange('account')}>
          <FontAwesomeIcon icon={faUser} className="settings-icon" />
          Account Settings
        </button>
        <button className={activeSection === 'security' ? 'active' : ''} onClick={() => handleSectionChange('security')}>
          <FontAwesomeIcon icon={faLock} className="settings-icon" />
          Security Settings
        </button>
        <button className={activeSection === 'general' ? 'active' : ''} onClick={() => handleSectionChange('general')}>
          <FontAwesomeIcon icon={faCog} className="settings-icon" />
          General Settings
        </button>
        <button className={activeSection === 'calendar' ? 'active' : ''} onClick={() => handleSectionChange('calendar')}>
          <FontAwesomeIcon icon={faCalendarAlt} className="settings-icon" />
          Calendar Settings
        </button>
        <button className={activeSection === 'support' ? 'active' : ''} onClick={() => handleSectionChange('support')}>
          <FontAwesomeIcon icon={faQuestionCircle} className="settings-icon" />
          Support & Feedback
        </button>
      </div>
      <div className="settings-content">
        {activeSection === 'account' && (
          <div className="settings-section">
            <h2><FontAwesomeIcon icon={faUser} className="section-icon" /> Account Settings</h2>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" placeholder="Enter your username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="Enter your email" />
              <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
            </div>
            <div className="form-actions">
              <button className="save-button"><FontAwesomeIcon icon={faSave} /> Save Changes</button>
            </div>
          </div>
        )}
        {activeSection === 'security' && (
          <div className="settings-section">
            <h2><FontAwesomeIcon icon={faLock} className="section-icon" /> Security Settings</h2>
            <div className="form-group">
              <label htmlFor="two-factor-auth">Two-Factor Authentication:</label>
              <input type="checkbox" id="two-factor-auth" />
              <label htmlFor="two-factor-auth">Enable</label>
            </div>
            <div className="form-group">
              <label htmlFor="password">Change Password:</label>
              <input type="password" id="password" placeholder="New Password" />
            </div>
            <div className="form-actions">
              <button className="save-button"><FontAwesomeIcon icon={faSave} /> Save Changes</button>
            </div>
          </div>
        )}
        {activeSection === 'general' && (
          <div className="settings-section">
            <h2><FontAwesomeIcon icon={faCog} className="section-icon" /> General Settings</h2>
            <div className="form-group">
              <label htmlFor="language">Select Language:</label>
              <select id="language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <FontAwesomeIcon icon={faGlobe} className="form-icon" />
            </div>
            <div className="form-group">
              <label htmlFor="timezone">Choose Timezone:</label>
              <select id="timezone">
                <option value="gmt">GMT</option>
                <option value="pst">PST</option>
                <option value="est">EST</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="theme">Select Theme:</label>
              <select id="theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <FontAwesomeIcon icon={faPalette} className="form-icon" />
            </div>
            <div className="form-actions">
              <button className="save-button"><FontAwesomeIcon icon={faSave} /> Save Changes</button>
            </div>
          </div>
        )}
        {activeSection === 'calendar' && (
          <div className="settings-section">
            <h2><FontAwesomeIcon icon={faCalendarAlt} className="section-icon" /> Calendar Settings</h2>
            <div className="form-group">
              <label htmlFor="calendar-sync">Enable Calendar Sync:</label>
              <input type="checkbox" id="calendar-sync" />
              <label htmlFor="calendar-sync">Enable</label>
            </div>
            <div className="form-group">
              <label htmlFor="time-zone">Set Time Zone:</label>
              <select id="time-zone">
                <option value="gmt">GMT</option>
                <option value="pst">PST</option>
                <option value="est">EST</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="default-view">Choose Default View:</label>
              <select id="default-view">
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="save-button"><FontAwesomeIcon icon={faSave} /> Save Changes</button>
            </div>
          </div>
        )}
        {activeSection === 'support' && (
          <div className="settings-section">
            <h2><FontAwesomeIcon icon={faQuestionCircle} className="section-icon" /> Support & Feedback</h2>
            <div className="form-group">
              <label htmlFor="support-query">Submit your query or feedback:</label>
              <textarea id="support-query" rows="5" placeholder="Describe your issue or feedback" />
            </div>
            <div className="form-actions">
              <button className="save-button"><FontAwesomeIcon icon={faSave} /> Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
