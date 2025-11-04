import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Search, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function EmailLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, filterType, filterStatus]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.EmailLog.list('-sent_date', 200);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load email logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    // Filter by search term (email or subject)
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by email type
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.email_type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    setFilteredLogs(filtered);
  };

  const getEmailTypeLabel = (type) => {
    const labels = {
      'mentor_approval': 'אישור מנטורית',
      'member_approval': 'אישור מנויה',
      'welcome': 'ברוכה הבאה',
      'trial_expiration': 'תפוגת ניסיון',
      'subscription_renewal': 'חידוש מנוי',
      'appointment_confirmation': 'אישור פגישה',
      'profile_completion': 'השלמת פרופיל',
      'general': 'כללי'
    };
    return labels[type] || type;
  };

  const getEmailTypeBadgeColor = (type) => {
    const colors = {
      'mentor_approval': 'bg-purple-100 text-purple-800',
      'member_approval': 'bg-blue-100 text-blue-800',
      'welcome': 'bg-green-100 text-green-800',
      'trial_expiration': 'bg-orange-100 text-orange-800',
      'subscription_renewal': 'bg-indigo-100 text-indigo-800',
      'appointment_confirmation': 'bg-cyan-100 text-cyan-800',
      'profile_completion': 'bg-amber-100 text-amber-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Count logs by type for filter buttons
  const emailTypeCounts = {
    all: logs.length,
    mentor_approval: logs.filter(l => l.email_type === 'mentor_approval').length,
    member_approval: logs.filter(l => l.email_type === 'member_approval').length,
    welcome: logs.filter(l => l.email_type === 'welcome').length,
    trial_expiration: logs.filter(l => l.email_type === 'trial_expiration').length,
    profile_completion: logs.filter(l => l.email_type === 'profile_completion').length,
    general: logs.filter(l => l.email_type === 'general').length,
  };

  const statusCounts = {
    all: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-rose-500" />
                לוגי מיילים
              </h1>
              <p className="text-gray-600 mt-2">כל המיילים שנשלחו מהמערכת</p>
            </div>
            <Button onClick={loadLogs} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
              רענון
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-rose-500" />
              סינון וחיפוש
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="חיפוש לפי מייל, שם או נושא..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Email Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">סינון לפי סוג מייל:</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-rose-500 hover:bg-rose-600' : ''}
                >
                  הכל ({emailTypeCounts.all})
                </Button>
                <Button
                  variant={filterType === 'profile_completion' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('profile_completion')}
                  className={filterType === 'profile_completion' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                >
                  תזכורות פרופיל ({emailTypeCounts.profile_completion})
                </Button>
                <Button
                  variant={filterType === 'mentor_approval' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('mentor_approval')}
                  className={filterType === 'mentor_approval' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                >
                  אישור מנטורית ({emailTypeCounts.mentor_approval})
                </Button>
                <Button
                  variant={filterType === 'member_approval' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('member_approval')}
                  className={filterType === 'member_approval' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  אישור מנויה ({emailTypeCounts.member_approval})
                </Button>
                <Button
                  variant={filterType === 'welcome' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('welcome')}
                  className={filterType === 'welcome' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  ברוכה הבאה ({emailTypeCounts.welcome})
                </Button>
                <Button
                  variant={filterType === 'trial_expiration' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('trial_expiration')}
                  className={filterType === 'trial_expiration' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  תפוגת ניסיון ({emailTypeCounts.trial_expiration})
                </Button>
                <Button
                  variant={filterType === 'general' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('general')}
                  className={filterType === 'general' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                >
                  כללי ({emailTypeCounts.general})
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">סינון לפי סטטוס:</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-rose-500 hover:bg-rose-600' : ''}
                >
                  הכל ({statusCounts.all})
                </Button>
                <Button
                  variant={filterStatus === 'sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('sent')}
                  className={filterStatus === 'sent' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <CheckCircle className="w-4 h-4 ml-1" />
                  נשלחו בהצלחה ({statusCounts.sent})
                </Button>
                <Button
                  variant={filterStatus === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('failed')}
                  className={filterStatus === 'failed' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  <XCircle className="w-4 h-4 ml-1" />
                  נכשלו ({statusCounts.failed})
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>מציג {filteredLogs.length} מתוך {logs.length} מיילים</strong>
                  {searchTerm && ` • חיפוש: "${searchTerm}"`}
                  {filterType !== 'all' && ` • סוג: ${getEmailTypeLabel(filterType)}`}
                  {filterStatus !== 'all' && ` • סטטוס: ${filterStatus === 'sent' ? 'נשלחו' : 'נכשלו'}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Logs Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {logs.length === 0 ? 'אין מיילים במערכת עדיין' : 'לא נמצאו מיילים התואמים את הסינון'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {log.status === 'sent' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{log.subject}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {log.recipient_name || log.recipient_email}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{log.recipient_email}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                          {log.sent_date ? format(new Date(log.sent_date), 'dd/MM/yyyy HH:mm', { locale: he }) : 'לא זמין'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getEmailTypeBadgeColor(log.email_type)}>
                        {getEmailTypeLabel(log.email_type)}
                      </Badge>
                      {log.sent_by && (
                        <span className="text-xs text-gray-500">נשלח ע"י: {log.sent_by}</span>
                      )}
                    </div>
                  </div>

                  {log.error_message && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <strong>שגיאה:</strong> {log.error_message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}