import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt, faCheckCircle, faTimesCircle, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import './css/Transactions.css'; // Ensure this CSS file is updated accordingly

const Transactions = () => {
  const tableContainerRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        let response;
        if (userId) {
          // If userId is specified, use the user-specific endpoint
          response = await axios.get(`${apiUrl}/transactions/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (startDate && endDate) {
          // Use the date range filtering endpoint
          response = await axios.get(`${apiUrl}/transactions/date-range`, {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Otherwise, use the general transactions endpoint without filtering
          response = await axios.get(`${apiUrl}/transactions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setTransactions(response.data);
        setError(null);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 403) {
            setError('Forbidden: You are not allowed to view these transactions.');
          } else if (err.response.status === 400) {
            setError('Bad Request: Please ensure all required fields are filled correctly.');
          } else {
            setError('Failed to fetch transactions.');
          }
        } else {
          setError('Failed to fetch transactions.');
        }
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, [apiUrl, userId, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      tableContainerRef.current.requestFullscreen().catch((err) => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen().catch((err) => console.error('Fullscreen exit error:', err));
    }
  };

  const handleFilterByUser = () => {
    if (userId) {
      fetchTransactions(); // Fetch transactions filtered by user ID
    } else {
      setError('Please enter a valid User ID to filter.');
    }
  };

  const handleFilterByDateRange = () => {
    if (startDate && endDate) {
      fetchTransactions(); // Fetch transactions filtered by date range
    } else {
      setError('Please select both start and end dates to filter.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="transactions">
      <div className="main-content">
        <div className="content">
          <div className="filter-controls">
            <input
              type="number"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleFilterByUser}>
              <FontAwesomeIcon icon={faUser} className="filter-icon" /> Filter by User
            </button>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />
            <button onClick={handleFilterByDateRange}>
              <FontAwesomeIcon icon={faCalendar} className="filter-icon" /> Filter by Date Range
            </button>
          </div>
          <div className="table-container" ref={tableContainerRef}>
            <div className="table-header-container">
              <h2 className="table-heading">Transactions</h2>
              <button className="fullscreen-button" onClick={handleFullscreenToggle} aria-label="Toggle Fullscreen">
                <FontAwesomeIcon icon={faExpandArrowsAlt} className="fullscreen-icon" />
              </button>
            </div>
            <div className="table">
              <div className="table-header">
                <div></div>
                <div>ID</div>
                <div>Amount</div>
                <div>Description</div>
                <div>Timestamp</div>
                <div>Reference</div>
                <div>Flagged</div>
              </div>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div className="table-row" key={transaction.id}>
                    <input type="checkbox" className="row-checkbox" aria-label={`Select transaction ${transaction.id}`} />
                    <div>{transaction.id}</div>
                    <div>Ksh {transaction.amount}</div>
                    <div>{transaction.description}</div>
                    <div>{new Date(transaction.timestamp).toLocaleString()}</div>
                    <div>{transaction.transaction_ref}</div>
                    <div>
                      <FontAwesomeIcon
                        icon={transaction.is_flagged ? faCheckCircle : faTimesCircle}
                        className={transaction.is_flagged ? 'flagged-icon' : 'unflagged-icon'}
                        aria-label={transaction.is_flagged ? 'Flagged' : 'Not Flagged'}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-transactions">No transactions found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
