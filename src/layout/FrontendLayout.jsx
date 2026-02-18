import { useState } from "react";
import { Outlet, NavLink } from "react-router";

import logo from "../assets/images/BanriLogo 1.svg"

function FrontendLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

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
                <NavLink className="nav-link" to="/products" onClick={closeMenu}>
                  產品列表
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart" onClick={closeMenu}>
                  購物車
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/checkout" onClick={closeMenu}>
                  結帳頁面
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login" onClick={closeMenu}>
                  前往後台
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

export default FrontendLayout;
