import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

import logo from "../assets/images/BanriLogo 1.svg";
import useMessage from "../hooks/useMessage";

function AdminPayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();

  const logout = async () => {
    try {
      const res = await axios.post(`${API_BASE}/logout`);
      document.cookie =
        "hexW2Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/hex-2025-react-week7;";
      navigate("/login");
      showSuccess(res.data.message);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
            <img src={logo} alt="Banri" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin/products"
                  onClick={closeMenu}
                >
                  後台產品列表
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin/orders"
                  onClick={closeMenu}
                >
                  後台訂單列表
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: "150px" }}>
        <div className="mt-4 d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/")}
          >
            回前台
          </button>
          <button className="btn btn-outline-primary" onClick={() => logout()}>
            登出
          </button>
        </div>
        <Outlet />
      </main>
    </>
  );
}

export default AdminPayout;
