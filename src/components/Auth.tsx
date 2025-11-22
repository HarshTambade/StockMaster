import { useState } from 'react';
import { User } from '../App';
import { Package, Mail, Lock, UserIcon, KeyRound, ArrowLeft, CheckCircle, AlertCircle, Home } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface AuthProps {
  onLogin: (token: string, user: User) => void;
  onBackToHome?: () => void;
}

export default function Auth({ onLogin, onBackToHome }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home Button */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isResetPassword 
              ? 'Enter your email to receive a reset code' 
              : isLogin 
              ? 'Sign in to continue to StockMaster' 
              : 'Start managing your inventory today'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field (Login/Signup) */}
            {!isResetPassword && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {/* Full Name Field (Signup) */}
            {!isLogin && !isResetPassword && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            {/* OTP Fields (Reset Password) */}
            {isResetPassword && otpSent && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter 6-digit code"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {isResetPassword
                    ? otpSent
                      ? 'Reset Password'
                      : 'Send OTP'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            {!isResetPassword ? (
              <>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setMessage('');
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
                {isLogin && (
                  <div>
                    <button
                      onClick={() => {
                        setIsResetPassword(true);
                        setOtpSent(false);
                        setError('');
                        setMessage('');
                      }}
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
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
                  setError('');
                  setMessage('');
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}