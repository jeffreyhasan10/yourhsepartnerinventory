
import React, { useState, useContext } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import InventoryTracking from '../components/InventoryTracking';
import SafetyAlerts from '../components/SafetyAlerts';
import TaskList from '../components/cultures/TaskList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Filter, RefreshCw, Upload, Printer, BarChart3 } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';
import { AuthContext } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useContext(AuthContext);
  
  const { 
    lastSync,
    isRefreshing,
    syncDataAcrossCRM,
    exportModuleData,
    importModuleData,
    printModuleData
  } = useCRM();

  const getTabActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={syncDataAcrossCRM}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Data
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExportData('dashboard')}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleImportData()}
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handlePrintData('dashboard')}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        );
      case 'inventory':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExportData('inventory')}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handlePrintData('inventory')}
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </div>
        );
      case 'safety':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExportData('safety')}
            >
              <Download className="h-4 w-4" />
              Export Alerts
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Configure Alerts
            </Button>
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExportData('tasks')}
            >
              <Download className="h-4 w-4" />
              Export Tasks
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handlePrintData('tasks')}
            >
              <Printer className="h-4 w-4" />
              Print Tasks
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Tab changed to: ${value}`);
  };

  const handleExportData = async (tab: string) => {
    const moduleMapping: {[key: string]: string} = {
      'dashboard': 'statistics',
      'inventory': 'inventory',
      'safety': 'safety',
      'tasks': 'tasks'
    };
    
    const module = moduleMapping[tab] || 'statistics';
    const format = tab === 'dashboard' ? 'excel' : 'csv';
    
    try {
      await exportModuleData(module, format as 'csv' | 'excel' | 'pdf');
      console.log(`Export of ${module} data in ${format} format initiated`);
    } catch (error) {
      console.error(`Error exporting ${module}:`, error);
    }
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    
    const moduleMapping = {
      'dashboard': 'statistics',
      'inventory': 'inventory',
      'safety': 'safety',
      'tasks': 'tasks'
    };
    
    const module = moduleMapping[activeTab] || 'statistics';
    
    try {
      await importModuleData(module, selectedFile);
      console.log(`Import of file ${selectedFile.name} successful`);
    } catch (error) {
      console.error(`Error importing ${module}:`, error);
    }
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintData = async (tab: string) => {
    const moduleMapping = {
      'dashboard': 'statistics',
      'inventory': 'inventory',
      'safety': 'safety',
      'tasks': 'tasks'
    };
    
    const module = moduleMapping[tab] || 'statistics';
    
    try {
      await printModuleData(module);
      console.log(`Print of ${module} data initiated`);
    } catch (error) {
      console.error(`Error printing ${module}:`, error);
    }
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Dashboard Overview',
      content: <Dashboard />
    },
    {
      value: 'inventory',
      label: 'Inventory Tracking',
      content: <InventoryTracking />
    },
    {
      value: 'safety',
      label: 'Safety Alerts',
      content: <SafetyAlerts />
    },
    {
      value: 'tasks',
      label: 'Tasks & Activities',
      content: <TaskList />
    }
  ];

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role} Dashboard | Last sync: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart3 className="h-4 w-4" />
                YourHSEPartner System
              </div>
              {getTabActions()}
            </div>
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">CSV File</Label>
                  <input 
                    type="file" 
                    id="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Data will be imported to the current module. 
                  Make sure the file is in CSV format.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleImportConfirm}>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
