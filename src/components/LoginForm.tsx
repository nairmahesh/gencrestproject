import React, { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid credentials. Please check your username and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    setUsername(role);
    setPassword(role);
  };

  const roles = [
    { code: 'mdo', name: 'MDO', fullName: 'Market Development Officer', color: 'bg-blue-500' },
    { code: 'tsm', name: 'TSM', fullName: 'Territory Sales Manager', color: 'bg-green-500' },
    { code: 'rbh', name: 'RBH', fullName: 'Regional Business Head', color: 'bg-purple-500' },
    { code: 'rmm', name: 'RMM', fullName: 'Regional Marketing Manager', color: 'bg-orange-500' },
    { code: 'zbh', name: 'ZBH', fullName: 'Zonal Business Head', color: 'bg-indigo-500' },
    { code: 'mh', name: 'MH', fullName: 'Marketing Head', color: 'bg-pink-500' },
    { code: 'vp', name: 'VP', fullName: 'VP - Sales & Marketing', color: 'bg-red-500' },
    { code: 'md', name: 'MD', fullName: 'Managing Director', color: 'bg-gray-800' },
    { code: 'chro', name: 'CHRO', fullName: 'Chief HR Officer', color: 'bg-teal-500' },
    { code: 'cfo', name: 'CFO', fullName: 'Chief Financial Officer', color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Gencrest Portal</h1>
          <p className="text-purple-100">Role-Based Access System</p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your role (e.g., mdo, tsm)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Login</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {roles.slice(0, 8).map((role) => (
                <button
                  key={role.code}
                  onClick={() => quickLogin(role.code)}
                  className={`${role.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity text-center`}
                >
                  <div className="font-semibold text-sm">{role.name}</div>
                  <div className="text-xs opacity-90">{role.code}/{role.code}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {roles.slice(8).map((role) => (
                <button
                  key={role.code}
                  onClick={() => quickLogin(role.code)}
                  className={`${role.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity text-center`}
                >
                  <div className="font-semibold text-sm">{role.name}</div>
                  <div className="text-xs opacity-90">{role.code}/{role.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Format:</strong> role/role (e.g., mdo/mdo)</p>
              <p><strong>Available Roles:</strong> MDO, TSM, RBH, RMM, ZBH, MH, VP, MD, CHRO, CFO</p>
              <p><strong>Example:</strong> Username: <code>tsm</code>, Password: <code>tsm</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;