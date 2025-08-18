import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginAPI } from "../services/userServices";
import { loginUserAction } from "../redux/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Updated validation schema with enhanced password rules
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      // .matches(/[0-9]/, "Password must contain at least one number")
      // .matches(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)"),
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["UserLogin"],
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const token = await mutateAsync(values);
        sessionStorage.setItem("userToken", token);
        const decoded = jwtDecode(token);
        dispatch(loginUserAction(decoded));
        toast.success("Login successful!");

        if (decoded.role === "individual") navigate("/homepage2");
        else if (decoded.role === "moderator") navigate("/content-moderation");
        else navigate("/psychiatristdashboard");
      } catch {
        toast.error("Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-[90%] max-w-6xl shadow-xl rounded-3xl overflow-hidden">
        {/* Left Illustration Section */}
        <div className="w-1/2 bg-blue-50 flex items-center justify-center p-10">
          <img
            src="../log.svg"
            alt="login illustration"
            className="w-full max-w-md"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 bg-white p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back :)</h2>
          <p className="text-gray-500 mb-8">
            To keep connected with us please login with your personal information.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter username"
                {...formik.getFieldProps("username")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                {...formik.getFieldProps("password")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                Remember Me
              </label>
              <p
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Login Now"}
            </button>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate("/userregister")}
              >
                Create Account
              </span>
            </div>

            <div className="flex justify-center items-center gap-4 mt-4">
              <button className="border p-2 rounded-full hover:bg-gray-100">
                <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" alt="Google" />
              </button>
              <button className="border p-2 rounded-full hover:bg-gray-100">
                <img src="https://img.icons8.com/ios-filled/50/3b5998/facebook-new.png" className="w-5 h-5" alt="Facebook" />
              </button>
              <button className="border p-2 rounded-full hover:bg-gray-100">
                <img src="https://img.icons8.com/ios-filled/50/1da1f2/twitter.png" className="w-5 h-5" alt="Twitter" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;