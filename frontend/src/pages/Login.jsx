import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData?.name || 'User'}!`, 'Authentication Successful');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please verify your credentials.';
      setError(errorMsg);
      toast.error(errorMsg, 'Login Error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#4F8CFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Centered Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-elevated border border-[#1F2937] p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#F9FAFB]">
                Resum<span className="text-[#4F8CFF]">AI</span>
              </span>
            </Link>

            <h2 className="text-2xl font-bold text-[#F9FAFB] tracking-tight">
              Log in to your account
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Welcome back! Access your ATS reports & AI rewrites.
            </p>
          </div>

          {/* Validation Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1F2937] bg-[#111827] text-[#4F8CFF] focus:ring-[#4F8CFF]/20"
                />
                <span>Remember me</span>
              </label>

              <a href="#forgot" className="text-[#4F8CFF] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Footer Link to Register */}
          <div className="text-center pt-2 text-xs text-[#9CA3AF]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#4F8CFF] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
