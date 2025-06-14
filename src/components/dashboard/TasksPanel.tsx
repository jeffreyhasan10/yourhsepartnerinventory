
import React, { useState } from 'react';
import { Edit, Trash2, Check, X, Plus, Clock, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface Task {
  id: number;
  title: string;
  due: string;
  priority: string;
  assignedTo?: string;
  department?: string;
}

interface TasksPanelProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    due: '',
    priority: 'medium',
    assignedTo: '',
    department: ''
  });
  
  // Task editing
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
    toast.success('Task updated successfully');
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };
  
  // Add new task
  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.due.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const taskToAdd = {
      id: newId,
      ...newTask
    };
    
    setTasks([...tasks, taskToAdd]);
    setShowAddTaskDialog(false);
    setNewTask({
      title: '',
      due: '',
      priority: 'medium',
      assignedTo: '',
      department: ''
    });
    
    toast.success('New task added successfully');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Upcoming Tasks</h3>
            <p className="text-sm text-gray-500">Manage your daily activities</p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={() => setShowAddTaskDialog(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-start p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
            >
              <div 
                className={`w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0 ${
                  task.priority === 'high' 
                    ? 'bg-red-500' 
                    : task.priority === 'medium' 
                      ? 'bg-orange-500' 
                      : 'bg-green-500'
                }`}
              />
              
              <div className="flex-1 min-w-0">
                {editingTask === task.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedTaskTitle}
                      onChange={(e) => setEditedTaskTitle(e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleSaveTask(task.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setEditingTask(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 text-sm leading-5">{task.title}</h4>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-1.5 hover:bg-gray-100 rounded-md" 
                          onClick={() => handleEditTask(task.id)}
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          className="p-1.5 hover:bg-red-50 rounded-md text-red-500" 
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Due: {task.due}
                      </div>
                      
                      {task.assignedTo && (
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {task.assignedTo}
                        </div>
                      )}
                      
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.department && (
                      <p className="text-xs text-gray-400 mt-1">{task.department}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No upcoming tasks</p>
              <p className="text-gray-400 text-xs">Add a task to get started</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title *</Label>
              <Input
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                placeholder="Person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={newTask.department}
                onChange={(e) => setNewTask({...newTask, department: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Department</option>
                <option value="Safety Management">Safety Management</option>
                <option value="HSE Department">HSE Department</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Training">Training</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.due}
                onChange={(e) => setNewTask({...newTask, due: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} className="bg-green-600 hover:bg-green-700">
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPanel;
