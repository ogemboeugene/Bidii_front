import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSort, faFileCsv, faSun, faMoon, faExpand, faCompress, faRedo, faPrint, faFilter, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import "./css/FormAdvanceWindow.css";

const FormAdvanceWindow = ({ historyId, onClose }) => {
  const [formRecords, setFormRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("group_id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchFormRecords = async () => {
      try {
        const response = await axios.get(`${apiUrl}/query_advance_history?group_id=${historyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        console.log("API Response Data:", response.data); // Log response data
        if (response.data.advance_history && Array.isArray(response.data.advance_history)) {
          setFormRecords(response.data.advance_history); // Extract the array from the response
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching form records:", error);
      }
    };

    fetchFormRecords();
  }, [historyId, apiUrl]);

  const handleSort = (field) => {
    const newSortDirection = (sortField === field && sortDirection === "asc") ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newSortDirection);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExport = () => {
    const csvRows = [];
    const headers = [
      "Member Name", "Initial Amount", "Payment Amount", "Is Paid", "User ID", "Status",
      "Created At", "Updated At", "Interest Rate", "Paid Amount", "Total Amount Due",
      "Group ID", "Month", "Year"
    ];
    csvRows.push(headers.join(","));

    formRecords.forEach(record => {
      const values = [
        record.member_name,
        record.initial_amount,
        record.payment_amount,
        record.is_paid,
        record.user_id,
        record.status,
        record.created_at,
        record.updated_at,
        record.interest_rate,
        record.paid_amount,
        record.total_amount_due,
        record.group_id,
        record.month,
        record.year
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form_records.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRefresh = async () => {
    try {
      const response = await axios.get(`${apiUrl}/query_advance_history?group_id=${historyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.data.advance_history && Array.isArray(response.data.advance_history)) {
        setFormRecords(response.data.advance_history); // Extract the array from the response
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error refreshing form records:", error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Form Records</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Form Records</h2>
        ${document.querySelector(".window-body").innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFilter = () => {
    // Implement filter logic
  };

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleFullscreenToggle = () => {
    setIsFullScreen(prevState => !prevState);
  };

  const filteredRecords = (Array.isArray(formRecords) ? formRecords : []).filter(record =>
    record.member_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortDirection === "asc") {
      return (a[sortField] > b[sortField] ? 1 : -1);
    } else {
      return (a[sortField] < b[sortField] ? 1 : -1);
    }
  });

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const currentRecords = sortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className={`form-records-window ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isFullScreen ? 'full-screen' : ''}`}>
      <div className="window-header">
        <h2>Form Records</h2>
        <button className="theme-toggle-button" onClick={handleThemeToggle}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
        <button className="fullscreen-toggle-button" onClick={handleFullscreenToggle}>
          <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
        </button>
        <button className="refresh-button" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <button className="print-button" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} />
        </button>
        <button className="filter-button" onClick={handleFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
        <button className="help-button" onClick={handleHelp}>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="window-body">
        <input
          type="text"
          className="search-input"
          placeholder="Search by member name..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="export-button" onClick={handleExport}>
          <FontAwesomeIcon icon={faFileCsv} /> Export to CSV
        </button>
        <table className="records-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("member_name")}>
                Member Name 
                <FontAwesomeIcon icon={faSort} className={sortField === "member_name" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("initial_amount")}>
                Initial Amount 
                <FontAwesomeIcon icon={faSort} className={sortField === "initial_amount" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("payment_amount")}>
                Payment Amount 
                <FontAwesomeIcon icon={faSort} className={sortField === "payment_amount" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("is_paid")}>
                Is Paid 
                <FontAwesomeIcon icon={faSort} className={sortField === "is_paid" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("user_id")}>
                User ID 
                <FontAwesomeIcon icon={faSort} className={sortField === "user_id" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("status")}>
                Status 
                <FontAwesomeIcon icon={faSort} className={sortField === "status" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("created_at")}>
                Created At 
                <FontAwesomeIcon icon={faSort} className={sortField === "created_at" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("updated_at")}>
                Updated At 
                <FontAwesomeIcon icon={faSort} className={sortField === "updated_at" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("interest_rate")}>
                Interest Rate 
                <FontAwesomeIcon icon={faSort} className={sortField === "interest_rate" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("paid_amount")}>
                Paid Amount 
                <FontAwesomeIcon icon={faSort} className={sortField === "paid_amount" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("total_amount_due")}>
                Total Amount Due 
                <FontAwesomeIcon icon={faSort} className={sortField === "total_amount_due" ? "active-sort" : ""} />
              </th>
              {/* <th onClick={() => handleSort("group_id")}>
                Group ID 
                <FontAwesomeIcon icon={faSort} className={sortField === "group_id" ? "active-sort" : ""} />
              </th> */}
              {/* <th onClick={() => handleSort("month")}>
                Month 
                <FontAwesomeIcon icon={faSort} className={sortField === "month" ? "active-sort" : ""} />
              </th>
              <th onClick={() => handleSort("year")}>
                Year 
                <FontAwesomeIcon icon={faSort} className={sortField === "year" ? "active-sort" : ""} />
              </th> */}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.member_name}</td>
                  <td>{record.initial_amount}</td>
                  <td>{record.payment_amount}</td>
                  <td>{record.is_paid ? "Yes" : "No"}</td>
                  <td>{record.user_id}</td>
                  <td>{record.status}</td>
                  <td>{record.created_at}</td>
                  <td>{record.updated_at}</td>
                  <td>{record.interest_rate}</td>
                  <td>{record.paid_amount}</td>
                  <td>{record.total_amount_due}</td>
                  {/* <td>{record.group_id}</td> */}
                  {/* <td>{record.month}</td>
                  <td>{record.year}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {showHelp && (
          <div className="help-modal">
            <h3>Help</h3>
            <p>Here you can manage and view form records. Use the search box to filter records by member name.</p>
            <p>Use the sort icons in table headers to sort records.</p>
            <p>Click Export to CSV to download records in CSV format.</p>
            <button onClick={handleCloseHelp}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormAdvanceWindow;
