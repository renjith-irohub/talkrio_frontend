import { useState } from 'react';
import { forgotAPI } from '../services/userServices';
import { useMutation } from '@tanstack/react-query';
import { FiMail, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const [message, setMessage] = useState(null);

  // Validation schema for email
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await mutateAsync({ email: values.email });
        setMessage(`If an account with ${values.email} exists, a password reset link has been sent.`);
      } catch (error) {
        setMessage('An error occurred. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { mutateAsync, isLoading: isSubmitting } = useMutation({
    mutationFn: forgotAPI,
    mutationKey: ['Forgot'],
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            {message ? 'Check your email for further instructions' : 'Enter your email to reset your password'}
          </p>
        </div>

        {message ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={() => {
                setMessage(null);
                formik.resetForm();
              }}
              className="w-full max-w-xs mx-auto py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Back to form
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send reset link
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;