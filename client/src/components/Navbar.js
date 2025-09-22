import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CButton,
} from "@coreui/react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = token
    ? [
        { path: "/profile", label: "Profile" },
        { path: "/problems", label: "Topics" },
        { path: "/progress", label: "Progress" },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
      ];

  return (
    <CNavbar
      expand="lg"
      colorScheme="dark"
      className="shadow-sm mb-4"
      style={{
        background: "linear-gradient(90deg, #2c3e70, #3b4a8a)",
        padding: "1rem 2rem",
      }}
    >
      <CContainer fluid>
        {" "}
        <CNavbarBrand
          style={{ fontWeight: "bold", color: "#fff", fontSize: "1.5rem" }}
        >
          Dashboard
        </CNavbarBrand>
        <CNavbarNav
          className="ms-auto d-flex align-items-center"
          style={{ gap: "1rem" }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <CNavItem key={item.path}>
                <CNavLink
                  to={item.path}
                  component={Link}
                  style={{
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "1rem",
                    position: "relative",
                    padding: "0.5rem 0.8rem",
                    transition: "all 0.3s ease",
                  }}
                  className={isActive ? "active-nav-link" : ""}
                >
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "0",
                        width: "100%",
                        height: "3px",
                        borderRadius: "2px",
                        background: "#e74c3c",
                        boxShadow: "0 0 8px #e74c3c",
                        transition: "all 0.3s ease",
                      }}
                    />
                  )}
                </CNavLink>
              </CNavItem>
            );
          })}

          {token && (
            <CNavItem>
              <CButton
                color="light"
                shape="rounded-pill"
                size="md"
                onClick={handleLogout}
                style={{ marginLeft: "2rem", padding: "0.4rem 1.2rem" }}
              >
                Logout
              </CButton>
            </CNavItem>
          )}
        </CNavbarNav>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;
