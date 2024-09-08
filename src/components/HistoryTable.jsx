import React, { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandArrowsAlt, faTable, faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import FormRecordsWindow from "../forms/FormRecordsWindow";
import FormAdvanceWindow from "../forms/FormAdvanceWindow"; // Import the new form
import "./css/HistoryTable.css";

const HistoryTable = () => {
  const tableContainerRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isAdvanceForm, setIsAdvanceForm] = useState(false); // State to track form type
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch all history data initially
  const fetchHistoryData = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      axios
        .get(`${apiUrl}/histories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Add clickable property to each record
          const dataWithClickable = response.data.map(record => ({ ...record, clickable: true }));
          setHistoryData(dataWithClickable);
          setFilteredData(dataWithClickable);
        })
        .catch((error) => {
          console.error("There was an error fetching the history data!", error);
        });
    } else {
      console.warn("No auth token found.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  // Filter data based on selected option
  const filterData = (filter) => {
    const token = localStorage.getItem("authToken");

    if (filter === "performance") {
      axios
        .get(`${apiUrl}/histories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Add clickable property to each record
          const dataWithClickable = response.data.map(record => ({ ...record, clickable: true }));
          setFilteredData(dataWithClickable);
        })
        .catch((error) => {
          console.error("Error fetching monthly performance data:", error);
        });
    } else if (filter === "advance") {
      axios
        .get(`${apiUrl}/query_advance_summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Add clickable property to each record
          const dataWithClickable = response.data.map(record => ({ ...record, clickable: true }));
          setFilteredData(dataWithClickable);
        })
        .catch((error) => {
          console.error("Error fetching advance performance data:", error);
        });
    } else {
      const performanceRequest = axios.get(`${apiUrl}/histories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const advanceRequest = axios.get(`${apiUrl}/query_advance_summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Promise.all([performanceRequest, advanceRequest])
        .then(([performanceResponse, advanceResponse]) => {
          // Combine data and add clickable property only for non-"Show All" filters
          const performanceData = performanceResponse.data.map(record => ({ ...record, clickable: false }));
          const advanceData = advanceResponse.data.map(record => ({ ...record, clickable: false }));
          setFilteredData([...performanceData, ...advanceData]);
        })
        .catch((error) => {
          console.error("Error fetching combined data:", error);
        });
    }
  };

  const handleRowClick = (id, clickable) => {
    if (clickable) {
      setSelectedHistoryId(id);
      setFormVisible(true);
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedHistoryId(null);
    setIsAdvanceForm(false); // Reset form type on close
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      tableContainerRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen mode:", err);
      });
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    filterData(filter);
    if (filter === "advance") {
      setIsAdvanceForm(true); // Set form type when advance filter is selected
    } else {
      setIsAdvanceForm(false); // Reset form type for other filters
    }
  };

  // Determine which form to show based on the current filter
  const determineFormToShow = () => {
    if (selectedFilter === "advance") {
      return <FormAdvanceWindow historyId={selectedHistoryId} onClose={handleCloseForm} />;
    }
    return <FormRecordsWindow historyId={selectedHistoryId} onClose={handleCloseForm} />;
  };

  return (
    <div className="history-table">
      <div className="main-content">
        <div className="content">
          <div className="table-container" ref={tableContainerRef}>
            <div className="table-header-container">
              <div className="filter-buttons">
                <button
                  className={`filter-button ${selectedFilter === "performance" ? "active" : ""}`}
                  onClick={() => handleFilterClick("performance")}
                >
                  Group Monthly Performance
                </button>
                <button
                  className={`filter-button ${selectedFilter === "advance" ? "active" : ""}`}
                  onClick={() => handleFilterClick("advance")}
                >
                  Group Advance Performance
                </button>
                <button
                  className={`filter-button ${selectedFilter === "all" ? "active" : ""}`}
                  onClick={() => handleFilterClick("all")}
                >
                  Show All
                </button>
              </div>
              <div className="table-header-title">
                <FontAwesomeIcon icon={faTable} className="table-icon" />
                <h2>History Table</h2>
                <span className="filter-info">Current Filter: {selectedFilter}</span>
                <div className="header-icons">
                  <FontAwesomeIcon icon={faFilter} className="icon filter-icon" title="Filter" />
                  <button className="fullscreen-button" onClick={handleFullscreenToggle}>
                    <FontAwesomeIcon icon={faExpandArrowsAlt} className="fullscreen-icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="table">
              <div className="table-header">
                <div className="header-group-name">
                  Group Name
                  <FontAwesomeIcon icon={faSort} className="icon sort-icon" title="Sort" />
                </div>
                <div className="header-date">
                  Date
                  <FontAwesomeIcon icon={faSort} className="icon sort-icon" title="Sort" />
                </div>
              </div>
              {filteredData.map((entry) => (
                <div
                  className={`table-row ${entry.clickable ? "clickable" : ""}`} // Add class based on clickable
                  key={entry.id}
                  onClick={() => handleRowClick(entry.id, entry.clickable)} // Pass clickable flag
                >
                  <div>{entry.group_name}</div>
                  <div>{entry.date}</div>
                </div>
              ))}
            </div>
            <div className="footer-info">
              Total Entries: {historyData.length}
            </div>
          </div>
        </div>
      </div>
      {isFormVisible && determineFormToShow()}
    </div>
  );
};

export default HistoryTable;
