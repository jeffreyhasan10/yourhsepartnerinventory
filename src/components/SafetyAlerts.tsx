
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Shield, Calendar, Filter } from 'lucide-react';

const SafetyAlerts = () => {
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const safetyAlerts = [
    {
      id: 1,
      title: 'PPE Expiry Alert',
      description: 'Safety helmets batch #SH-2024-001 expires in 15 days',
      level: 'warning',
      category: 'Expiry',
      dateCreated: '2024-06-15',
      dueDate: '2024-06-30',
      status: 'active'
    },
    {
      id: 2,
      title: 'Chemical Storage Temperature',
      description: 'Temperature in chemical storage area exceeds safe limits',
      level: 'critical',
      category: 'Environmental',
      dateCreated: '2024-06-15',
      dueDate: '2024-06-15',
      status: 'active'
    },
    {
      id: 3,
      title: 'First Aid Kit Inspection Due',
      description: 'Monthly inspection required for first aid stations',
      level: 'medium',
      category: 'Maintenance',
      dateCreated: '2024-06-10',
      dueDate: '2024-06-20',
      status: 'active'
    },
    {
      id: 4,
      title: 'Fire Extinguisher Service',
      description: 'Annual service due for fire extinguishers in Zone A',
      level: 'medium',
      category: 'Maintenance',
      dateCreated: '2024-06-08',
      dueDate: '2024-06-25',
      status: 'active'
    },
    {
      id: 5,
      title: 'Safety Training Reminder',
      description: 'Quarterly safety training session scheduled',
      level: 'info',
      category: 'Training',
      dateCreated: '2024-06-01',
      dueDate: '2024-06-30',
      status: 'scheduled'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredAlerts = filterLevel === 'all' 
    ? safetyAlerts 
    : safetyAlerts.filter(alert => alert.level === filterLevel);

  const alertCounts = {
    critical: safetyAlerts.filter(a => a.level === 'critical').length,
    warning: safetyAlerts.filter(a => a.level === 'warning').length,
    medium: safetyAlerts.filter(a => a.level === 'medium').length,
    info: safetyAlerts.filter(a => a.level === 'info').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Safety Alerts</h2>
          <p className="text-gray-600">Monitor safety-critical items and compliance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Alerts</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="medium">Medium</option>
            <option value="info">Info</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-700">{alertCounts.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Warning</p>
                <p className="text-2xl font-bold text-yellow-700">{alertCounts.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Medium</p>
                <p className="text-2xl font-bold text-orange-700">{alertCounts.medium}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Info</p>
                <p className="text-2xl font-bold text-blue-700">{alertCounts.info}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="grid gap-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getLevelIcon(alert.level)}
                  <div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  </div>
                </div>
                <Badge className={getLevelColor(alert.level)}>
                  {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{alert.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date Created</p>
                  <p className="font-medium">{alert.dateCreated}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {alert.dueDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{alert.status}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Mark Resolved
                </Button>
                {alert.level === 'critical' && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    Take Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">No safety alerts match the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default SafetyAlerts;
