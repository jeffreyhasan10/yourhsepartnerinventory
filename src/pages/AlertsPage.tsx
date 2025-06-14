
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { AlertTriangle, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import usePageMetadata from '../hooks/use-page-metadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'expiry',
      severity: 'critical',
      title: 'Chemical Expired',
      description: 'Hydrochloric Acid (HCl) expired on 2024-06-10',
      category: 'Chemicals',
      timestamp: '2024-06-15T10:30:00',
      acknowledged: false
    },
    {
      id: 2,
      type: 'low_stock',
      severity: 'warning',
      title: 'Low Stock Alert',
      description: 'N95 Respirator Masks below minimum threshold (8 units remaining)',
      category: 'PPE',
      timestamp: '2024-06-14T14:20:00',
      acknowledged: false
    },
    {
      id: 3,
      type: 'expiry_soon',
      severity: 'warning',
      title: 'Expiring Soon',
      description: 'Cut-Resistant Gloves expire in 15 days (2024-07-01)',
      category: 'PPE',
      timestamp: '2024-06-14T09:15:00',
      acknowledged: true
    },
    {
      id: 4,
      type: 'missing_msds',
      severity: 'high',
      title: 'Missing MSDS',
      description: 'Acetone does not have an updated Material Safety Data Sheet',
      category: 'Chemicals',
      timestamp: '2024-06-13T16:45:00',
      acknowledged: false
    }
  ]);
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Alerts & Notifications',
    defaultDescription: 'Monitor critical alerts, expiry warnings, and stock notifications across all inventory categories'
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiry':
      case 'expiry_soon':
        return <Calendar className="h-4 w-4" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'missing_msds':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleDismiss = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<AlertTriangle className="h-6 w-6" />}
        />

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-700">
                    {alerts.filter(a => a.severity === 'critical').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">High Priority</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {alerts.filter(a => a.severity === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {alerts.filter(a => a.severity === 'warning').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Acknowledged</p>
                  <p className="text-2xl font-bold text-green-700">
                    {acknowledgedAlerts.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Active Alerts ({unacknowledgedAlerts.length})</h3>
            <div className="space-y-4">
              {unacknowledgedAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert className={getSeverityColor(alert.severity)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                          <AlertDescription className="mb-2">
                            {alert.description}
                          </AlertDescription>
                          <p className="text-xs opacity-75">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="whitespace-nowrap"
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Acknowledged Alerts */}
        {acknowledgedAlerts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Acknowledged Alerts ({acknowledgedAlerts.length})</h3>
            <div className="space-y-4">
              {acknowledgedAlerts.map((alert) => (
                <Card key={alert.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-600">{alert.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Acknowledged
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {alert.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(alert.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="mt-8 text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
            <p className="text-gray-500">All systems are operating normally. No alerts to display.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AlertsPage;
