import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

function ActionHistory() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page, pagesize, searchTerm) => {
    try {
      const searchParam = searchTerm
        ? `&searchTerm=${encodeURIComponent(searchTerm)}`
        : "";
      const response = await fetch(
        `http://localhost:3000/api/get-action-history?page=${page}&pagesize=${pagesize}${searchParam}`
      );
      console.log(searchParam);
      const result = await response.json();
      setData(result.data || []);
      setTotalRecords(result.totalRecords || 0);
      setTotalPages(Math.ceil((result.totalRecords || 0) / pagesize));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  // Gọi API khi trang hoặc số dòng hiển thị thay đổi (không bao gồm searchTerm)
  useEffect(() => {
    fetchData(currentPage, rowsPerPage, searchTerm);
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval khi component bị hủy
    return () => clearInterval(intervalId);
  }, [currentPage, rowsPerPage, searchTerm]);

  // Hàm gọi API khi nhấn nút tìm kiếm
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    fetchData(1, rowsPerPage, searchTerm); // Gọi API với từ khóa tìm kiếm và quay về trang 1
    setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <h2>Action History</h2>

      {/* Search Bar with Search Button */}
      <form onSubmit={handleSearchSubmit} className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
            <th>Device</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.device}</td>
                <td>{row.action}</td>
                <td>{moment(row.time).format("YYYY-MM-DD HH:mm:ss")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
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

export default ActionHistory;
