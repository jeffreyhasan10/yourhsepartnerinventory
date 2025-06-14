
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
  X
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

// Sample data for HSE inventory system
const monthlyData = [
  { month: 'Jan', issues: 45, returns: 40, compliance: 95 },
  { month: 'Feb', issues: 52, returns: 48, compliance: 97 },
  { month: 'Mar', issues: 48, returns: 45, compliance: 94 },
  { month: 'Apr', issues: 61, returns: 58, compliance: 96 },
  { month: 'May', issues: 55, returns: 52, compliance: 98 },
  { month: 'Jun', issues: 67, returns: 63, compliance: 95 },
];

const categoryData = [
  { name: 'PPE', value: 40, color: '#10B981' },
  { name: 'Chemicals', value: 25, color: '#F59E0B' },
  { name: 'General Store', value: 20, color: '#3B82F6' },
  { name: 'Medical', value: 15, color: '#EF4444' },
];

const initialTasks = [
  { id: 1, title: 'Inspect safety helmets batch #SH-001', due: 'Today', priority: 'high', category: 'PPE' },
  { id: 2, title: 'Reorder chemical gloves', due: 'Tomorrow', priority: 'medium', category: 'Chemicals' },
  { id: 3, title: 'Monthly first aid kit check', due: 'June 20', priority: 'low', category: 'Medical' },
  { id: 4, title: 'Update MSDS documentation', due: 'June 22', priority: 'medium', category: 'Compliance' },
];

const initialAlerts = [
  { id: 1, message: 'Low stock: N95 masks (8 units remaining)', type: 'warning', category: 'PPE' },
  { id: 2, message: 'Expiry alert: Chemical gloves expire in 7 days', type: 'danger', category: 'Chemical' },
  { id: 3, message: 'Compliance reminder: Monthly safety audit due', type: 'info', category: 'Audit' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(`Welcome to YourHSEPartner`);
  const [description, setDescription] = useState('Professional Inventory Management System');
  
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      default:
        return 'bg-gray-50 border-l-gray-500 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-gray-600 mt-1">
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
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  <EditableField
                    value={totalItems}
                    type="number"
                    onSave={(value) => setTotalItems(Number(value))}
                    className="inline-block"
                  />
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-yellow-600">
                  <EditableField
                    value={lowStockItems}
                    type="number"
                    onSave={(value) => setLowStockItems(Number(value))}
                    className="inline-block"
                  />
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-red-600">
                  <EditableField
                    value={expiringItems}
                    type="number"
                    onSave={(value) => setExpiringItems(Number(value))}
                    className="inline-block"
                  />
                </p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-green-600">
                  <EditableField
                    value={complianceScore}
                    type="number"
                    onSave={(value) => setComplianceScore(Number(value))}
                    className="inline-block"
                  />%
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorIssues)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex-1">
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                          className="border rounded px-2 py-1 text-sm flex-1"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveTask(task.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setEditingTask(null)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">Due: {task.due}</p>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                  {editingTask !== task.id && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditTask(task.id)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-red-500"
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
        
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">Category: {alert.category}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
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
              <Label htmlFor="itemName" className="text-right">Name</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-3"
                placeholder="Item name"
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
                className="col-span-3"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">Unit</Label>
              <select
                id="unit"
                value={newItem.unit}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="pieces">Pieces</option>
                <option value="boxes">Boxes</option>
                <option value="liters">Liters</option>
                <option value="kg">Kilograms</option>
                <option value="pairs">Pairs</option>
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
