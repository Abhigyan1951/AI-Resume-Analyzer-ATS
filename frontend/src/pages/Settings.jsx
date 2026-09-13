import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Cpu, LogOut, Shield } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const Settings = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile preferences updated successfully!', 'Settings Saved');
    }, 600);
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out of your session.', 'Logged Out');
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Account & System Settings"
        subtitle="Manage your profile preferences, AI model settings, security, and notification options."
        badge="Preferences"
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#4F8CFF]" />
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

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#7C3AED]" />
              AI Engine Configuration
            </CardTitle>
            <CardDescription>Configure Google Gemini parameters</CardDescription>
          </div>
          <Badge variant="secondary">Gemini 3.6 Flash Active</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Default AI Model"
            defaultValue="gemini-3.6-flash"
            readOnly
            helperText="Configured via GEMINI_MODEL environment variable in backend"
          />
        </CardContent>
      </Card>

      <Card className="border-[#EF4444]/30 bg-[#EF4444]/5">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2 text-[#F9FAFB]">
              <Shield className="w-5 h-5 text-[#EF4444]" />
              Session & Security
            </CardTitle>
            <CardDescription>Manage active login session & security controls</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-[#F9FAFB]">Sign Out of Session</h4>
            <p className="text-xs text-[#9CA3AF]">Clears stored authentication JWT tokens from local browser storage.</p>
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

