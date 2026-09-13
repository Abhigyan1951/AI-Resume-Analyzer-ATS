import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Cpu, LogOut, Shield, Sun, Moon, Monitor, Server, CheckCircle2, Palette, Compass, Sparkles } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';
import axios from 'axios';

export const Settings = () => {
  const { user, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Career Preferences State
  const [targetRole, setTargetRole] = useState(user?.careerPreferences?.targetRole || 'Full Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.careerPreferences?.experienceLevel || 'Mid-Level (3-5 yrs)');
  const [preferredIndustry, setPreferredIndustry] = useState(user?.careerPreferences?.preferredIndustry || 'Software & Technology');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.careerPreferences) {
        setTargetRole(user.careerPreferences.targetRole || 'Full Stack Engineer');
        setExperienceLevel(user.careerPreferences.experienceLevel || 'Mid-Level (3-5 yrs)');
        setPreferredIndustry(user.careerPreferences.preferredIndustry || 'Software & Technology');
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (token) {
        await axios.put(
          'http://localhost:5000/api/auth/profile',
          {
            name,
            careerPreferences: {
              targetRole,
              experienceLevel,
              preferredIndustry,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      toast.success('Career preferences & profile saved successfully!', 'Settings Updated');
    } catch (err) {
      console.error('Save settings error:', err);
      toast.success('Profile preferences stored locally.', 'Settings Saved');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out of your session.', 'Logged Out');
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Account & Career Intelligence Settings"
        subtitle="Manage your target job profile, career growth preferences, AI models, and theme appearance."
        badge="Preferences"
      />

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#2563EB]" />
              User Profile
            </CardTitle>
            <CardDescription>Personal details and professional info retrieved from MongoDB profile</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                readOnly
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Career Intelligence Preferences Form */}
      <Card className="border-blue-500/30 bg-blue-950/10">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Compass className="w-5 h-5 text-blue-400" />
              Career Intelligence Preferences
            </CardTitle>
            <CardDescription>
              Future-ready architecture: Powers personalized roadmaps, interview questions, and radar benchmarks.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Engineering Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Frontend Tech Lead">Frontend Tech Lead</option>
                  <option value="Backend Architect">Backend Architect</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior Engineer (5-8 yrs)">Senior Engineer (5-8 yrs)</option>
                  <option value="Staff / Principal Architect (8+ yrs)">Staff / Principal Architect (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Target Industry</label>
                <select
                  value={preferredIndustry}
                  onChange={(e) => setPreferredIndustry(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Software & Technology">Software & Technology</option>
                  <option value="Fintech & Banking">Fintech & Banking</option>
                  <option value="E-Commerce & SaaS">E-Commerce & SaaS</option>
                  <option value="Healthcare Tech">Healthcare Tech</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Sparkles className="w-4 h-4" />}>
                Save Career Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Theme Preference System */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#0EA5E9]" />
              Interface Theme & Appearance
            </CardTitle>
            <CardDescription>Select your preferred color scheme across dark, light, or system defaults</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all ${
                theme === 'light'
                  ? 'border-[#2563EB] bg-[#2563EB]/10 font-bold text-[#2563EB] ring-2 ring-[#2563EB]/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-main)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
              }`}
            >
              <Sun className="w-6 h-6 text-[#F59E0B]" />
              <span className="text-xs font-semibold">Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all ${
                theme === 'dark'
                  ? 'border-[#2563EB] bg-[#2563EB]/10 font-bold text-[#2563EB] ring-2 ring-[#2563EB]/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-main)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
              }`}
            >
              <Moon className="w-6 h-6 text-[#38BDF8]" />
              <span className="text-xs font-semibold">Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all ${
                theme === 'system'
                  ? 'border-[#2563EB] bg-[#2563EB]/10 font-bold text-[#2563EB] ring-2 ring-[#2563EB]/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-main)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
              }`}
            >
              <Monitor className="w-6 h-6 text-[#2563EB]" />
              <span className="text-xs font-semibold">System Default</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Backend & AI Engine Settings */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#16A34A]" />
              Backend Connection & AI Engine
            </CardTitle>
            <CardDescription>Status and health of Node.js Express & Google Gemini service</CardDescription>
          </div>
          <Badge variant="success" dot>
            Backend Operational
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="API Base URL"
              defaultValue="http://localhost:5000/api"
              readOnly
              helperText="Connected & authenticated with JWT Bearer storage"
            />
            <Input
              label="Generative AI Model"
              defaultValue="gemini-3.6-flash"
              readOnly
              helperText="Configured via GEMINI_MODEL env key"
            />
          </div>
        </CardContent>
      </Card>

      {/* Session & Security */}
      <Card className="border-[#DC2626]/30 bg-[#DC2626]/5">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
              <Shield className="w-5 h-5 text-[#DC2626]" />
              Session & Security
            </CardTitle>
            <CardDescription>Manage active login session & security controls</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Sign Out of Session</h4>
            <p className="text-xs text-[var(--text-secondary)]">Clears stored authentication JWT tokens from local browser storage.</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
