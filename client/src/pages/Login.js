import React, { useState, useContext } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CFormFeedback,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const addForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email(),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.post("/api/auth/login", values);
        setToken(res.data.token);
        toast.success("Login successful!");
        navigate("/problems");
      } catch (error) {
        if (error.response?.data?.error) {
          error.response.data.error
            .split(",")
            .forEach((msg) => toast.error(msg.trim()));
        } else {
          toast.error("Can Not Connect To Server !!");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <CForm onSubmit={addForm.handleSubmit}>
        <div
          className="bg-light min-vh-100 d-flex flex-row align-items-start"
          style={{ paddingTop: "7rem" }}
        >
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={5}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">
                        Sign In to your account
                      </p>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          invalid={
                            !!(addForm.touched.email && addForm.errors.email)
                          }
                          {...addForm.getFieldProps("email")}
                        />
                        {!!(addForm.touched.email && addForm.errors.email) && (
                          <CFormFeedback invalid>
                            {addForm.errors.email}
                          </CFormFeedback>
                        )}
                      </CInputGroup>

                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          invalid={
                            !!(
                              addForm.touched.password &&
                              addForm.errors.password
                            )
                          }
                          {...addForm.getFieldProps("password")}
                        />
                        <CInputGroupText
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </CInputGroupText>
                        {!!(
                          addForm.touched.password && addForm.errors.password
                        ) && (
                          <CFormFeedback invalid>
                            {addForm.errors.password}
                          </CFormFeedback>
                        )}
                      </CInputGroup>

                      <CRow>
                        <center>
                          <CCol xs={6}>
                            <CButton
                              color="primary"
                              className="px-4"
                              disabled={loading}
                              type="submit"
                            >
                              Login{" "}
                              {loading && (
                                <CSpinner
                                  component="span"
                                  size="sm"
                                  className="mr-2"
                                />
                              )}
                            </CButton>
                          </CCol>
                        </center>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </CForm>

      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default Login;
