import React, { useEffect, useState, useContext } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from "@coreui/react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <CContainer className="mt-4">
        <h2>No profile found</h2>
      </CContainer>
    );
  }

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard className="shadow-lg">
            <CCardHeader>
              <h3 className="mb-0">👤 Profile</h3>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Name:</strong> {user.name}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Email:</strong> {user.email}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Gender:</strong> {user.gender}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(user.dob).toLocaleDateString()}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Problems Completed:</strong>{" "}
                  {user.progress?.length || 0}
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Profile;
