import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const API_URL = import.meta.env.VITE_API_URL;

  // Login Component
const Login = ({ onLogin = () => {} }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      onLogin(res.data.user, res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/chat');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Neural network authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-teal-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-1/4 w-40 h-40 bg-cyan-400/8 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-orange-400/8 rounded-full animate-ping" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-16 w-24 h-24 bg-yellow-400/8 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        
        {/* Animated Border Lines */}
        <div className="absolute top-20 left-20 w-32 h-1 bg-gradient-to-r from-cyan-400/30 to-transparent animate-pulse transform rotate-12"></div>
        <div className="absolute bottom-32 right-16 w-40 h-1 bg-gradient-to-r from-orange-400/30 to-transparent animate-pulse transform -rotate-45"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-1 bg-gradient-to-r from-yellow-400/30 to-transparent animate-pulse transform rotate-90"></div>
      </div>

      {/* Main Login Panel */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-800/80 to-cyan-800/80 backdrop-blur-xl p-8 rounded-2xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl mb-4 shadow-lg shadow-cyan-400/30 relative">
              <span className="text-2xl text-gray-900 font-bold">🌐</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-cyan-100 mb-2">
              <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Node Access
              </span>
            </h2>
            <p className="text-cyan-300 text-sm">Reconnect to the digital nexus</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Neural Link Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-4 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all group-hover:border-cyan-400/50"
                    placeholder="your@email.node"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${formData.email.includes('@') ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Security Protocol
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-4 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all group-hover:border-cyan-400/50"
                    placeholder="Enter access key..."
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${formData.password.length >= 6 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg shadow-cyan-400/30 border-2 border-cyan-300/50 disabled:border-gray-600/50 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                    <span>Establishing Connection...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 relative z-10 group">
                    <span>Access Node</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">🌐</span>
                  </div>
                )}
              </button>
            </form>

            {/* Additional Options */}
            <div className="space-y-3">
              <button className="text-cyan-300 hover:text-cyan-200 text-sm font-medium hover:underline transition-colors block mx-auto">
                Forgot your access key?
              </button>
              
              {/* Navigation Link */}
              <div className="text-center pt-4 border-t border-cyan-400/20">
                <p className="text-cyan-300 text-sm">
                  Need to initialize a new node?{' '}
                  <button
                    className="text-orange-300 hover:text-orange-200 font-semibold hover:underline transition-colors"
                    onClick={() => navigate('/register')} 
                  >
                    Create node access
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-cyan-400/40 rounded transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-orange-400/40 rounded transform rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -right-6 w-4 h-4 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 -left-6 w-3 h-3 bg-orange-400/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Connection Status Indicator */}
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <div className="flex items-center gap-1 bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-400/40">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-medium">Network Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;