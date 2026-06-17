import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navabar = () => {
  const location = useLocation();
  const adminUser = localStorage.getItem("adminUser")
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    navigate("/admin")
  }

  const isActive = (path) => {
    return location.pathname === path
      ? "fw-bold pb-1 text-primary"
      : "";
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
        <div className="container-fluid px-3">
          <Link className="navbar-brand" to="#">
            <span
              className="rounded-circle"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "5px 10px",
                marginRight: "15px",
              }}
            >
              <i className="fa-solid fa-book-open-reader"></i>
            </span>
            <span>SmartLibrary</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
              {!adminUser && (
                <>

                  <li className="nav-item">
                    <Link
                      className={`nav-link active d-flex align-items-center px-3 py-2 ${isActive("/")}`}
                      to="/"
                    >
                      <i className="fa-solid fa-house me-2"></i>
                      Home
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link d-flex align-items-center px-3 py-2 ${isActive("/login")}`}
                      to="/login"
                    >
                      <i className="fa-solid fa-user me-2"></i>
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link d-flex align-items-center px-3 py-2 ${isActive("/signup")}`}
                      to="/signup"
                    >
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Sign Up
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`d-flex align-items-center px-3 py-2 btn btn-primary to="/admin"`}
                      to="/admin"
                    >
                      <i className="fa-solid fa-user-shield me-2"></i>
                      Admin
                    </Link>
                  </li>
                </>
              )}


              {adminUser && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`d-flex align-items-center px-3 py-2 ${isActive("/admin/dashboard")}`}
                      to="/admin/dashboard"
                    >
                      <i className="fa-solid fa-gauge-high me-2"></i>
                      Dashboard
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                      <i className="fa-solid me-1 fa-layer-group me-2"></i>Categories
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item" to="/admin/add-category"
                        >
                          <i className="fa-solid fa-plus me-1"></i>
                          Add Categories
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item" to="/admin/manage-categories"
                        >
                          <i className="fa-solid fa-list me-1"></i>
                          Manage categories
                        </Link>
                      </li>

                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                      <i className="fa-solid me-1 fa-layer-group me-2"></i>Authors
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item" to="/author/add-author"
                        >
                          <i className="fa-solid fa-plus me-1"></i>
                          Add Author
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item" to="/author/manage-author"
                        >
                          <i className="fa-solid fa-list me-1"></i>
                          Manage Author
                        </Link>
                      </li>

                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                      <i className="fa-solid me-1 fa-book me-2"></i>Books
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item" to="/book/add-book"
                        >
                          <i className="fa-solid fa-plus me-1"></i>
                          Add Books
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item" to="/book/manage-book"
                        >
                          <i className="fa-solid fa-list me-1"></i>
                          Manage Books
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item" to="/book/issued-books"
                        >
                          <i className="fa-solid fa-arrow-right-arrow-left me-1"></i>
                          Issued Books
                        </Link>
                      </li>
                    </ul>
                  </li>

                  
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/")}`}
                      to="/admin/dashboard"
                    >
                      <i className="fa-solid fa-users me-1"></i>
                      Students
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/")}`}
                      to="/admin/dashboard"
                    >
                      <i className="fa-solid fa-right-from-bracket me-1"></i>
                      Issued Books
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/admin/change-password")}`}
                      to="/admin/change-password"
                    >
                      <i className="fa-solid fa-key me-1"></i>
                      Change Password
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-outline-danger"
                      to="/admin/dashboard"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket me-1"></i>
                      Logout
                    </button>
                  </li>




                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navabar;
