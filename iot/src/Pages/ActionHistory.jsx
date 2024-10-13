import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap nếu chưa có

function ActionHistory() { 
  const generateData = () => {
    let devices = ["led", "fan", "air conditioner"];
    let actions = ["on", "off"];
    let data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        id: i,
        device: devices[Math.floor(Math.random() * devices.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        time: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleString(), // Random time
      });
    }
    return data;
  };

  const [data, setData] = useState(generateData());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  // Lọc dữ liệu dựa trên thời gian tìm kiếm
  const filteredData = data.filter((row) =>
    row.time.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <h2>Action History</h2>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      

      {/* Bảng hiển thị dữ liệu */}
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.device}</td>
              <td>{row.action}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`btn btn-outline-primary ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionHistory;
