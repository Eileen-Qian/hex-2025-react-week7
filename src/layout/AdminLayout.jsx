import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import logo from "../assets/images/BanriLogo 1.svg"

function AdminPayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
      } catch (error) {
        console.error(error.response.data.message);
        navigate("/login");
      }
    };
    checkLogin()
  }, [navigate])

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
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/products" onClick={closeMenu}>
                  後台產品列表
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/orders" onClick={closeMenu}>
                  後台訂單列表
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: "150px" }}>
        <Outlet />
      </main>
    </>
  );
}

export default AdminPayout;
