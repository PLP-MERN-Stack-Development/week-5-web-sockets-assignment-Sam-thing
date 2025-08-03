import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onLogin = () => {} }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password synchronization failed');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security protocol requires minimum 6 characters');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      onLogin(res.data.user, res.data.token);
      navigate('/chat'); 
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Neural network connection failed'
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
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-orange-400/10 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-yellow-400/10 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        
        {/* Rotating Lines */}
        <div className="absolute top-10 right-10 w-40 h-1 bg-gradient-to-r from-cyan-400/20 to-transparent animate-pulse transform rotate-45"></div>
        <div className="absolute bottom-20 left-10 w-32 h-1 bg-gradient-to-r from-orange-400/20 to-transparent animate-pulse transform -rotate-12"></div>
      </div>

      {/* Main Registration Panel */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-800/80 to-cyan-800/80 backdrop-blur-xl p-8 rounded-2xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl mb-4 shadow-lg shadow-cyan-400/30">
              <span className="text-2xl text-gray-900 font-bold">⚡</span>
            </div>
            <h2 className="text-3xl font-bold text-cyan-100 mb-2">
              <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Initialize Node
              </span>
            </h2>
            <p className="text-cyan-300 text-sm">Connect to the digital nexus</p>
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Node Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all"
                    placeholder="Enter your handle..."
                    value={formData.username}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={20}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full ${formData.username.length >= 3 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Neural Link Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all"
                    placeholder="your@email.node"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full ${formData.email.includes('@') ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Security Protocol
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all"
                    placeholder="Create access key..."
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-cyan-200 font-semibold mb-2 text-sm">
                  Verify Security Protocol
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full bg-gray-700/60 border-2 border-cyan-400/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-400/20 transition-all"
                    placeholder="Confirm access key..."
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.confirmPassword && formData.password === formData.confirmPassword 
                        ? 'bg-green-400 animate-pulse' 
                        : formData.confirmPassword 
                        ? 'bg-red-400 animate-pulse' 
                        : 'bg-gray-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg shadow-cyan-400/30 border-2 border-cyan-300/50 disabled:border-gray-600/50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  <span>Establishing Connection...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Initialize Node</span>
                  <span>⚡</span>
                </div>
              )}
            </button>

            {/* Navigation Link */}
            <div className="text-center pt-4 border-t border-cyan-400/20">
              <p className="text-cyan-300 text-sm">
                Already connected to the network?{' '}
                <button 
                  className="text-orange-300 hover:text-orange-200 font-semibold hover:underline transition-colors"
                  onClick={() => window.location.href = '/login'}
                >
                  Access your node
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-cyan-400/40 rounded transform rotate-45"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-orange-400/40 rounded transform rotate-12"></div>
        <div className="absolute top-1/2 -right-6 w-4 h-4 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 -left-6 w-3 h-3 bg-orange-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Register;