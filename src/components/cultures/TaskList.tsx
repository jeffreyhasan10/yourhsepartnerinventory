
import React, { useState } from 'react';
import { Check, Trash2, ChevronDown, Plus, Calendar, Tag, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Task {
  id: number;
  task: string;
  department: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: string;
}

const initialTasks: Task[] = [
  { id: 1, task: 'PPE inventory audit', department: 'Safety Management', date: '2023-12-25', priority: 'High', status: 'Pending', assignedTo: 'John Smith' },
  { id: 2, task: 'Chemical storage inspection', department: 'HSE Department', date: '2023-12-28', priority: 'Medium', status: 'In Progress', assignedTo: 'Sarah Johnson' },
  { id: 3, task: 'Equipment maintenance check', department: 'Maintenance', date: '2023-12-30', priority: 'Low', status: 'Pending', assignedTo: 'Mike Wilson' },
  { id: 4, task: 'Safety training session', department: 'Training', date: '2024-01-05', priority: 'Medium', status: 'Pending', assignedTo: 'Lisa Brown' },
  { id: 5, task: 'Emergency drill planning', department: 'Safety Management', date: '2024-01-10', priority: 'High', status: 'Pending', assignedTo: 'David Lee' },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    task: '',
    department: '',
    date: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: ''
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'Completed' as Task['status'] } : task
    ));
    toast.success('Task marked as completed');
  };

  const handleTaskDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const handlePriorityChange = (id: number, priority: Task['priority']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
    toast.success(`Priority changed to "${priority}"`);
  };

  const handleStatusChange = (id: number, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    toast.success(`Status changed to "${status}"`);
  };

  const handleAddTask = () => {
    if (!newTask.task || !newTask.department || !newTask.date || !newTask.assignedTo) {
      toast.error('Please fill all required fields');
      return;
    }

    const taskToAdd: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      task: newTask.task,
      department: newTask.department,
      date: newTask.date,
      priority: newTask.priority as Task['priority'] || 'Medium',
      status: newTask.status as Task['status'] || 'Pending',
      assignedTo: newTask.assignedTo
    };

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      task: '',
      department: '',
      date: '',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: ''
    });
    setShowAddTask(false);
    toast.success('New task added successfully');
  };

  const pendingTasks = tasks.filter(task => task.status !== 'Completed').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'High' && task.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityTasks}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tasks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <CardTitle>Tasks & Activities</CardTitle>
            </div>
            <Button 
              onClick={() => setShowAddTask(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">TASK</TableHead>
                  <TableHead className="w-[15%]">DEPARTMENT</TableHead>
                  <TableHead className="w-[15%]">ASSIGNED TO</TableHead>
                  <TableHead className="w-[10%]">DUE DATE</TableHead>
                  <TableHead className="w-[10%]">PRIORITY</TableHead>
                  <TableHead className="w-[10%]">STATUS</TableHead>
                  <TableHead className="w-[10%]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{task.task}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1.5 text-green-600" />
                        {task.department}
                      </div>
                    </TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      {new Date(task.date).toLocaleDateString('en-US')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge className={`cursor-pointer ${getPriorityStyle(task.priority)}`}>
                            {task.priority} <ChevronDown className="ml-1 h-3 w-3 inline" />
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'High')}>
                            High
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Medium')}>
                            Medium
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Low')}>
                            Low
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge className={`cursor-pointer ${getStatusStyle(task.status)}`}>
                            {task.status} <ChevronDown className="ml-1 h-3 w-3 inline" />
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'Pending')}>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'In Progress')}>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'Completed')}>
                            Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleTaskComplete(task.id)}
                          className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                          title="Mark as completed"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTaskDelete(task.id)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No tasks to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskName" className="text-right">Task *</Label>
              <Input
                id="taskName"
                value={newTask.task}
                onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                placeholder="Task description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department *</Label>
              <select
                id="department"
                value={newTask.department}
                onChange={(e) => setNewTask({...newTask, department: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Department</option>
                <option value="Safety Management">Safety Management</option>
                <option value="HSE Department">HSE Department</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Training">Training</option>
                <option value="Quality Control">Quality Control</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">Assigned To *</Label>
              <Input
                id="assignedTo"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                placeholder="Person name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
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

export default TaskList;
