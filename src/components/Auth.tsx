import { useState } from 'react';
import { User } from '../App';

const API_URL = 'http://localhost:3001/api';

interface AuthProps {
  onLogin: (token: string, user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otp: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isResetPassword) {
        if (!otpSent) {
          const response = await fetch(`${API_URL}/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          });

          const data = await response.json();

          if (response.ok) {
            setOtpSent(true);
            setMessage(`OTP sent! (Dev mode: ${data.otp})`);
          } else {
            setError(data.error || 'Failed to send OTP');
          }
        } else {
          const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              otp: formData.otp,
              newPassword: formData.newPassword
            })
          });

          const data = await response.json();

          if (response.ok) {
            setMessage('Password reset successfully! Please login.');
            setTimeout(() => {
              setIsResetPassword(false);
              setOtpSent(false);
              setIsLogin(true);
            }, 2000);
          } else {
            setError(data.error || 'Failed to reset password');
          }
        }
      } else {
        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          onLogin(data.token, data.user);
        } else {
          setError(data.error || 'Authentication failed');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">StockMaster</h1>
          <p className="text-gray-600">
            {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {!isResetPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {!isLogin && !isResetPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {isResetPassword && otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            {isResetPassword
              ? otpSent
                ? 'Reset Password'
                : 'Send OTP'
              : isLogin
              ? 'Login'
              : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!isResetPassword ? (
            <>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:underline text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
              {isLogin && (
                <div>
                  <button
                    onClick={() => {
                      setIsResetPassword(true);
                      setOtpSent(false);
                    }}
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                setIsResetPassword(false);
                setOtpSent(false);
              }}
              className="text-purple-600 hover:underline text-sm"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}