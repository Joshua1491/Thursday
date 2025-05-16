import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type LoginResponse = {
  access_token: string;
  user: {
    username: string;
    roles: string[];
  };
};

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data: LoginResponse & { message?: string } = await response.json();

      if (response.ok && data.access_token) {
        // Destructure the response
        const { access_token, user } = data;
        // Store in localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Role-based redirect
        let redirectTo = '/login';
        if (user.roles.includes('Managing Director')) {
          redirectTo = '/roles/managing-director/personal-assistant';
        } else if (user.roles.includes('IT Team Admin')) {
          redirectTo = '/roles/it-team-admin/dashboard';
        } else if (user.roles.includes('System Admin')) {
          redirectTo = '/roles/system-admin/settings';
        } else if (user.roles.includes('Warehouse Manager')) {
          redirectTo = '/roles/warehouse-manager/inventory';
        } else if (user.roles.includes('Inventory Clerk')) {
          redirectTo = '/roles/inventory-clerk/scan';
        } else if (user.roles.includes('Quality Inspector')) {
          redirectTo = '/roles/quality-inspector/inspections';
        }
        router.replace(redirectTo);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors ${
                  (isLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login; 