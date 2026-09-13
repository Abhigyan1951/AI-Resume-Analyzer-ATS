import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-[#EF4444]' };
    if (score === 2 || score === 3) return { score: 65, label: 'Medium', color: 'bg-[#F59E0B]' };
    return { score: 100, label: 'Strong', color: 'bg-[#22C55E]' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully! Welcome to ResumAI.', 'Registration Complete');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, 'Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating Background Glow Orbs */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#4F8CFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Centered Register Card */}
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
              Create your account
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Start analyzing & optimizing your resume with AI today.
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-[#9CA3AF]">Password Strength</span>
                  <span className="text-[#F9FAFB] font-semibold">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          {/* Footer Link to Login */}
          <div className="text-center pt-2 text-xs text-[#9CA3AF]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4F8CFF] font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
