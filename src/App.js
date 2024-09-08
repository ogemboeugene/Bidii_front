import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Groups from './components/Groups';
import Advance from './components/Advance';
import NotificationWindow from './components/NotificationWindow';
import ProfileDropdown from './components/ProfileDropdown';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import PasswordResetPage from './components/PasswordResetPage'
import MonthlyAdvanceCredit from './components/MonthlyAdvanceCredit';
import Settings from './components/Settings'
import HistoryTable from './components/HistoryTable';
import Transactions from './components/Transactions';
import { RefreshProvider } from './components/RefreshContext'; // Import RefreshProvider

function App() {
  return (
    <RefreshProvider>
      <div className="App">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/advance" element={<Advance />} />
          <Route path="/notifications" element={<NotificationWindow />} />
          <Route path="/profile" element={<ProfileDropdown />} />  
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/signup" element={<SignUpPage />} /> 
          <Route path="/settings" element={<Settings />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
          <Route path="/reset_password/:token" element={<PasswordResetPage />} />
          <Route path="/monthly-advance-credit" element={<MonthlyAdvanceCredit />} />
          <Route path="/history-table" element={<HistoryTable />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </RefreshProvider>
  );
}

export default App;
