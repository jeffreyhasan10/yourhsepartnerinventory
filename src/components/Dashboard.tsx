import React, { useState, useContext } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Shield, 
  Users,
  Activity,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { EditableField } from './ui/editable-field';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AuthContext } from '../App';

const monthlyData = [
  { month: 'Jan', issues: 45, returns: 40, compliance: 95 },
  { month: 'Feb', issues: 52, returns: 48, compliance: 97 },
  { month: 'Mar', issues: 48, returns: 45, compliance: 94 },
  { month: 'Apr', issues: 61, returns: 58, compliance: 96 },
  { month: 'May', issues: 55, returns: 52, compliance: 98 },
  { month: 'Jun', issues: 67, returns: 63, compliance: 95 },
];

const categoryData = [
  { name: 'PPE', value: 40, color: '#329D4B' },
  { name: 'Chemicals', value: 25, color: '#F59E0B' },
  { name: 'General Store', value: 20, color: '#10B981' },
  { name: 'Medical', value: 15, color: '#EF4444' },
];

const initialTasks = [
  { id: 1, title: 'Inspect safety helmets batch #SH-001', due: 'Today', priority: 'high', category: 'PPE', status: 'pending' },
  { id: 2, title: 'Reorder chemical gloves', due: 'Tomorrow', priority: 'medium', category: 'Chemicals', status: 'in-progress' },
  { id: 3, title: 'Monthly first aid kit check', due: 'June 20', priority: 'low', category: 'Medical', status: 'pending' },
  { id: 4, title: 'Update MSDS documentation', due: 'June 22', priority: 'medium', category: 'Compliance', status: 'completed' },
];

const initialAlerts = [
  { id: 1, message: 'Low stock: N95 masks (8 units remaining)', type: 'warning', category: 'PPE', priority: 'high', time: '5 min ago' },
  { id: 2, message: 'Expiry alert: Chemical gloves expire in 7 days', type: 'danger', category: 'Chemical', priority: 'critical', time: '10 min ago' },
  { id: 3, message: 'Compliance reminder: Monthly safety audit due', type: 'info', category: 'Audit', priority: 'medium', time: '1 hour ago' },
  { id: 4, message: 'New safety equipment delivered and awaiting inspection', type: 'success', category: 'Delivery', priority: 'low', time: '2 hours ago' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(`Welcome to YourHSEPartner`);
  const [description, setDescription] = useState('Professional Health, Safety & Environment Management');
  
  // Key metrics
  const [totalItems, setTotalItems] = useState(1247);
  const [lowStockItems, setLowStockItems] = useState(23);
  const [expiringItems, setExpiringItems] = useState(8);
  const [complianceScore, setComplianceScore] = useState(96);
  
  // Tasks and alerts
  const [tasks, setTasks] = useState(initialTasks);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [newItemDialog, setNewItemDialog] = useState(false);
  
  // New item form
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'PPE',
    quantity: '',
    unit: 'pieces'
  });

  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast.success('Title updated');
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast.success('Description updated');
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setEditedTaskTitle(task.title);
    }
  };
  
  const handleSaveTask = (taskId: number) => {
    if (editedTaskTitle.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: editedTaskTitle } : task
    ));
    setEditingTask(null);
    toast.success('Task updated');
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted');
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alert dismissed');
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    console.log('Adding new item:', newItem);
    toast.success(`${newItem.name} added to inventory`);
    
    // Reset form
    setNewItem({
      name: '',
      category: 'PPE',
      quantity: '',
      unit: 'pieces'
    });
    setNewItemDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-l-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-l-yellow-500 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-l-blue-500 text-blue-700';
      case 'success':
        return 'bg-green-50 border-l-green-500 text-green-700';
      default:
        return 'bg-gray-50 border-l-gray-500 text-gray-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-gray-600">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className="inline-block"
              showEditIcon={true}
            />
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as: {user?.name} ({user?.role})
          </p>
        </div>
        <Button 
          onClick={() => setNewItemDialog(true)}
          className="bg-green-600 hover:bg-green-700 shadow-md text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full -translate-y-8 translate-x-8 opacity-30"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Total Items</CardTitle>
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-900">
                <EditableField
                  value={totalItems}
                  type="number"
                  onSave={(value) => setTotalItems(Number(value))}
                  className="inline-block"
                />
              </p>
              <div className="flex items-center text-xs text-green-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 rounded-full -translate-y-8 translate-x-8 opacity-30"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-800">Low Stock Items</CardTitle>
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-yellow-900">
                <EditableField
                  value={lowStockItems}
                  type="number"
                  onSave={(value) => setLowStockItems(Number(value))}
                  className="inline-block"
                />
              </p>
              <div className="flex items-center text-xs text-yellow-700">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                <span>-5% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-200 rounded-full -translate-y-8 translate-x-8 opacity-30"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-800">Expiring Soon</CardTitle>
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-900">
                <EditableField
                  value={expiringItems}
                  type="number"
                  onSave={(value) => setExpiringItems(Number(value))}
                  className="inline-block"
                />
              </p>
              <div className="flex items-center text-xs text-red-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+2 items this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full -translate-y-8 translate-x-8 opacity-30"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Compliance Score</CardTitle>
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-900">
                <EditableField
                  value={complianceScore}
                  type="number"
                  onSave={(value) => setComplianceScore(Number(value))}
                  className="inline-block"
                />%
              </p>
              <div className="flex items-center text-xs text-green-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+3% this quarter</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Monthly Activity</CardTitle>
                  <p className="text-sm text-gray-500">Equipment issues and returns</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#329D4B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#329D4B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#329D4B" 
                    fillOpacity={1} 
                    fill="url(#colorIssues)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
                  <p className="text-sm text-gray-500">Inventory breakdown by type</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">Updated</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Alerts with enhanced styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
                  <p className="text-sm text-gray-500">HSE activities and maintenance</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">{tasks.length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex-1">
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm flex-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveTask(task.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setEditingTask(null)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-sm text-gray-900 mb-2">{task.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{task.due}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {editingTask !== task.id && (
                    <div className="flex items-center gap-1 ml-2">
                      <button 
                        onClick={() => handleEditTask(task.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Alerts */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Safety Alerts</CardTitle>
                  <p className="text-sm text-gray-500">Critical notifications</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-red-50 text-red-700 text-xs">{alerts.length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)} hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getPriorityBadgeColor(alert.priority)}`}>
                            {alert.priority}
                          </Badge>
                          <span className="text-xs opacity-75">{alert.category}</span>
                          <span className="text-xs opacity-75">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-white/50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Item Dialog */}
      <Dialog open={newItemDialog} onOpenChange={setNewItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Item name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <select
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="PPE">PPE</option>
                <option value="Chemicals">Chemicals</option>
                <option value="General Store">General Store</option>
                <option value="Medical">Medical</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                placeholder="0"
                className="col-span-2"
              />
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="pieces">pieces</option>
                <option value="boxes">boxes</option>
                <option value="liters">liters</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewItemDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700">Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
