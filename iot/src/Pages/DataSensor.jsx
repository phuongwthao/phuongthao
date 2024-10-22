import React, { useState, useEffect } from "react";
import "./DataSensor.css"; // Import file CSS nếu cần thiết
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap nếu chưa có

function DataSensor() {
  const [data, setData] = useState([]); // Dữ liệu cảm biến
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số bản ghi mỗi trang
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [searchField, setSearchField] = useState("all"); // Trường tìm kiếm
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:3000/api/get-all-sensor-data?page=${currentPage}&pagesize=${rowsPerPage}&${
        searchField === "all" ? "all" : searchField
      }=${searchTerm}`
    );
    const result = await response.json();
    setData(result.data || []);
    setTotalPages(result.totalPages); // Cập nhật tổng số trang từ phản hồi
  };

  useEffect(() => {
    fetchData(); // Gọi hàm lấy dữ liệu khi component được mount
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval khi component bị hủy
    return () => clearInterval(intervalId);
  }, [currentPage, rowsPerPage, searchTerm, searchField]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    fetchData(1, rowsPerPage, searchTerm); // Gọi API với từ khóa tìm kiếm và quay về trang 1
    setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm
  };

  const renderPagination = () => {
    const paginationItems = [];
    const maxVisiblePages = 5;

    // Previous Button
    if (currentPage > 1) {
      paginationItems.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="btn btn-outline-primary"
        >
          Previous
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i <= maxVisiblePages || i === totalPages || i === 1) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`btn btn-outline-primary ${
              currentPage === i ? "active" : ""
            }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === maxVisiblePages + 1 && currentPage > maxVisiblePages + 2) ||
        (i === totalPages - 1 && currentPage < totalPages - 2)
      ) {
        paginationItems.push(
          <span key={`dot-${i}`} className="btn btn-outline-primary disabled">
            ...
          </span>
        );
      }
    }

    // Next Button
    if (currentPage < totalPages) {
      paginationItems.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="btn btn-outline-primary"
        >
          Next
        </button>
      );
    }

    return paginationItems;
  };

  return (
    <div className="container">
      <h2>Data Sensor</h2>

      {/* Search Bar and Select */}
      <form onSubmit={handleSearchSubmit} className="row mb-3">
        <div className="col-md-2">
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="light">Light</option>
            <option value="time">Time</option>
          </select>
        </div>

        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* <div className="col-md-2">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div> */}

        <div className="col-md-2">
          <select
            className="form-control"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </form>

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
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.temperature}</td>
                <td>{row.humidity}</td>
                <td>{row.light_level}</td>
                <td>{row.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination justify-content-center">
        {renderPagination()}
      </div>
    </div>
  );
}

export default DataSensor;
