import React from 'react';
import { Clock, FileText, ExternalLink } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const historyRecords = [
  { id: '1', date: '2026-08-28 14:30', name: 'Senior_FullStack_Engineer_2026.pdf', score: 94, role: 'Full Stack Engineer @ Vercel', status: 'Optimized' },
  { id: '2', date: '2026-08-27 18:15', name: 'Frontend_Lead_Resume_v2.pdf', score: 82, role: 'Frontend Tech Lead @ Stripe', status: 'Needs Review' },
  { id: '3', date: '2026-08-25 09:40', name: 'Software_Architect_Draft.pdf', score: 68, role: 'Principal Architect @ AWS', status: 'Low Match' },
  { id: '4', date: '2026-08-20 11:20', name: 'DevOps_Engineer_Resume.pdf', score: 90, role: 'Senior DevOps Engineer @ Datadog', status: 'Optimized' },
];

export const History = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis History & Activity Logs"
        subtitle="Review past resume evaluations, ATS scores, and historical AI optimization reports."
        badge="Activity Logs"
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Historical ATS Reports</CardTitle>
            <CardDescription>Search and filter your past ATS scoring sessions</CardDescription>
          </div>
          <div className="w-64">
            <Input isSearch placeholder="Search history..." className="py-1.5 text-xs bg-[#111827]" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#F9FAFB]">
              <thead className="text-xs text-[#9CA3AF] uppercase bg-[#1A2235]/40 border-b border-[#1F2937]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date & Time</th>
                  <th className="px-4 py-3 font-semibold">Resume File</th>
                  <th className="px-4 py-3 font-semibold">Target Job Role</th>
                  <th className="px-4 py-3 font-semibold">ATS Score</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/60">
                {historyRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A2235]/40 transition-colors">
                    <td className="px-4 py-3.5 text-[#9CA3AF] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#4F8CFF]" />
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-[#9CA3AF]">{item.role}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#4F8CFF]">{item.score}%</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={item.status === 'Optimized' ? 'success' : item.status === 'Needs Review' ? 'warning' : 'danger'} dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
