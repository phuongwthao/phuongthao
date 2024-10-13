import React, { useState } from "react";
import "./DataSensor.css"; // Import file CSS nếu cần thiết
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap nếu chưa có

function DataSensor() {
  const generateData = () => {
    let data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        id: i,
        temp: Math.floor(Math.random() * 35) + 15,
        humid: Math.floor(Math.random() * 100),
        light: Math.floor(Math.random() * 100),
        time: new Date().toLocaleString(),
      });
    }
    return data;
  };

  const [data, setData] = useState(generateData());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const rowsPerPage = 10;

  const filteredData = data.filter((row) => {
    if (searchField === "all") {
      return (
        row.temp.toString().includes(searchTerm) ||
        row.humid.toString().includes(searchTerm) ||
        row.light.toString().includes(searchTerm) ||
        row.time.toString().includes(searchTerm)
      );
    } else if (searchField === "temp") {
      return row.temp.toString().includes(searchTerm);
    } else if (searchField === "humid") {
      return row.humid.toString().includes(searchTerm);
    } else if (searchField === "light") {
      return row.light.toString().includes(searchTerm);
    } else if (searchField === "time") {
      return row.time.toString().includes(searchTerm);
    }
    return false;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <h2>Data Sensor</h2>

      {/* Search Bar and Select */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="temp">Temperature</option>
            <option value="humid">Humidity</option>
            <option value="light">Light</option>
            <option value="time">Time</option>
          </select>
        </div>

        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-3">
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="all">5</option>
            <option value="temp">10</option>
            <option value="humid">15</option>
            <option value="light">20</option>
            <option value="time">So phan tu</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Light (%)</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.temp}</td>
              <td>{row.humid}</td>
              <td>{row.light}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default DataSensor;
