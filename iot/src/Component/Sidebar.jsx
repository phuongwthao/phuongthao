import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/datasensor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Data Sensor
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/actionhistory"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Action History
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
