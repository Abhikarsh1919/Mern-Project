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
  CFormSelect,
} from "@coreui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const form = useFormik({
    initialValues: {
      name: "",
      dob: "",
      gender: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      dob: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "At least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.post("/api/auth/register", values);
        setToken(res.data.token);
        toast.success("Registration successful!");
        navigate("/problems");
      } catch (err) {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Registration failed");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <CForm onSubmit={form.handleSubmit}>
        <div
          className="bg-light min-vh-100 d-flex flex-row align-items-start"
          style={{ paddingTop: "3rem" }}
        >
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={6}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <h1>Register</h1>
                      <p className="text-medium-emphasis">
                        Create your account
                      </p>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Name</CInputGroupText>
                        <CFormInput
                          {...form.getFieldProps("name")}
                          invalid={!!(form.touched.name && form.errors.name)}
                        />
                        <CFormFeedback invalid>
                          {form.errors.name}
                        </CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>DOB</CInputGroupText>
                        <CFormInput
                          type="date"
                          {...form.getFieldProps("dob")}
                          invalid={!!(form.touched.dob && form.errors.dob)}
                        />
                        <CFormFeedback invalid>{form.errors.dob}</CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Gender</CInputGroupText>
                        <CFormSelect
                          {...form.getFieldProps("gender")}
                          invalid={
                            !!(form.touched.gender && form.errors.gender)
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </CFormSelect>
                        <CFormFeedback invalid>
                          {form.errors.gender}
                        </CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Email</CInputGroupText>
                        <CFormInput
                          {...form.getFieldProps("email")}
                          invalid={!!(form.touched.email && form.errors.email)}
                        />
                        <CFormFeedback invalid>
                          {form.errors.email}
                        </CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-4">
                        <CInputGroupText>Password</CInputGroupText>
                        <CFormInput
                          type="password"
                          {...form.getFieldProps("password")}
                          invalid={
                            !!(form.touched.password && form.errors.password)
                          }
                        />
                        <CFormFeedback invalid>
                          {form.errors.password}
                        </CFormFeedback>
                      </CInputGroup>

                      <CRow>
                        <center>
                          <CCol xs={6}>
                            <CButton
                              color="primary"
                              type="submit"
                              disabled={loading}
                            >
                              Register{" "}
                              {loading && (
                                <CSpinner size="sm" className="ms-2" />
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

      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default Register;
