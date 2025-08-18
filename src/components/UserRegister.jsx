import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../services/userServices";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { registerUserAction } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

const UserRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cvFile, setCvFile] = useState(null);

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register-user"],
  });

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
      // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      // .matches(/[0-9]/, "Password must contain at least one number")
      // .matches(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)"),
    role: Yup.string()
      .required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let dataToSend = { ...values };
        if (values.role === "psychiatrist") {
          if (!cvFile) {
            alert("Please upload your CV for verification.");
            return;
          }
          const formData = new FormData();
          formData.append("username", values.username);
          formData.append("email", values.email);
          formData.append("password", values.password);
          formData.append("role", values.role);
          formData.append("resume", cvFile);
          dataToSend = formData;
        }

        const token = await mutateAsync(dataToSend);
        sessionStorage.setItem("userToken", token);
        const decodedData = jwtDecode(token);
        dispatch(registerUserAction(decodedData));
        resetForm();
        setCvFile(null); // Reset CV file after submission

        if (decodedData.role === "psychiatrist") {
          alert("Registration successful! Please log in after verification by a moderator.");
          navigate("/login");
        } else if (decodedData.role === "individual") {
          navigate("/homepage");
        } else if (decodedData.role === "moderator") {
          navigate("/content-moderation");
        } else {
          navigate("/homepage");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred during registration.";
        console.error("Signup Error:", errorMessage);
        alert(errorMessage);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      setCvFile(null);
      event.target.value = ""; // Clear the input
    } else {
      setCvFile(file);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Header>
          <Logo>🧠</Logo>
          <Title>Create Your Account</Title>
          <Subtitle>Join our mental health community</Subtitle>
        </Header>

        <Form onSubmit={formik.handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. mindexplorer"
                hasError={formik.touched.username && formik.errors.username}
              />
              {formik.touched.username && formik.errors.username && (
                <Error>{formik.errors.username}</Error>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="your@email.com"
                hasError={formik.touched.email && formik.errors.email}
              />
              {formik.touched.email && formik.errors.email && (
                <Error>{formik.errors.email}</Error>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                hasError={formik.touched.password && formik.errors.password}
              />
              {formik.touched.password && formik.errors.password && (
                <Error>{formik.errors.password}</Error>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Your Role</Label>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                hasError={formik.touched.role && formik.errors.role}
              >
                <option value="">Select your role</option>
                <option value="individual">Individual</option>
                 {/* <option value="moderator">Moderator</option>  */}
                <option value="psychiatrist">Psychiatrist</option>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <Error>{formik.errors.role}</Error>
              )}
            </FormGroup>

            {formik.values.role === "psychiatrist" && (
              <FormGroup>
                <Label>Upload CV (PDF only)</Label>
                <FileInput
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <FileInfo>
                  {cvFile ? cvFile.name : "No file selected"}
                </FileInfo>
                <FileHint>Required for verification</FileHint>
              </FormGroup>
            )}
          </FormGrid>

          {isError && (
            <ErrorBox>
              <ErrorIcon>!</ErrorIcon>
              <span>{error.response?.data?.message || error.message}</span>
            </ErrorBox>
          )}

          <SubmitButton type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </SubmitButton>
        </Form>

        <LoginPrompt>
          Already have an account? <LoginLink href="/login">Sign in</LoginLink>
        </LoginPrompt>
      </FormContainer>
    </PageContainer>
  );
};

// Styled Components (unchanged)
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 2rem;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  cursor: pointer;
  
  &::file-selector-button {
    visibility: hidden;
  }
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background-color: white;
    outline: none;
  }
`;

const FileInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const FileHint = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1rem;
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background-color: white;
    outline: none;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231A202C%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background-color: white;
    outline: none;
  }
`;

const Error = styled.span`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  color: #e53e3e;
  font-size: 0.875rem;
  margin: 1.5rem 0;
`;

const ErrorIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: #e53e3e;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    transform: none;
    cursor: not-allowed;
    background: linear-gradient(135deg, #a3bffa 0%, #b794f4 100%);
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #718096;
`;

const LoginLink = styled.a`
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default UserRegister;