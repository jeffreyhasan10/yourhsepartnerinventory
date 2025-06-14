import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { 
  Package, 
  Plus, 
  ArrowUp, 
  ArrowDown,
  ChevronRight,
  X,
  Save,
  FileUp,
  FileDown,
  BarChart2,
  Trash2
} from 'lucide-react';
import { EditableTable, Column } from './ui/editable-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { EditableField } from './ui/editable-field';
import ConfirmDialog from './inventory/ConfirmDialog';
import { 
  exportInventoryToCSV, 
  importInventoryFromCSV,
  exportInventoryToPDF,
  downloadInventoryTemplate,
  InventoryItem 
} from './inventory/ImportExportFunctions';
import InventoryFilters from './inventory/InventoryFilters';
import InventoryStats from './inventory/InventoryStats';
import InventoryAlerts from './inventory/InventoryAlerts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

const initialInventoryData = [
  { 
    id: 1, 
    name: 'Safety Helmets', 
    category: 'Personal Protective Equipment', 
    quantity: 50, 
    unit: 'pieces', 
    minQuantity: 20, 
    price: 25.0,
    location: 'Safety Storage',
    lastUpdated: '2023-08-01'
  },
  { 
    id: 2, 
    name: 'NPK Fertilizer', 
    category: 'Fertilizers', 
    quantity: 800, 
    unit: 'kg', 
    minQuantity: 200, 
    price: 1.2,
    location: 'Main Warehouse',
    lastUpdated: '2023-07-15'
  },
  { 
    id: 3, 
    name: 'Herbicide RoundUp', 
    category: 'Chemicals', 
    quantity: 50, 
    unit: 'L', 
    minQuantity: 20, 
    price: 15,
    location: 'Secure Chemical Storage',
    lastUpdated: '2023-08-10'
  },
  { 
    id: 4, 
    name: 'Diesel Fuel', 
    category: 'Fuels', 
    quantity: 350, 
    unit: 'L', 
    minQuantity: 100, 
    price: 1.8,
    location: 'External Tank',
    lastUpdated: '2023-08-18'
  },
  { 
    id: 5, 
    name: 'Corn Seeds', 
    category: 'Seeds', 
    quantity: 80, 
    unit: 'kg', 
    minQuantity: 100, 
    price: 4.5,
    location: 'Main Warehouse',
    lastUpdated: '2023-07-22'
  },
  { 
    id: 6, 
    name: 'Motor Oil', 
    category: 'Lubricants', 
    quantity: 25, 
    unit: 'L', 
    minQuantity: 10, 
    price: 5.2,
    location: 'Workshop',
    lastUpdated: '2023-06-30'
  },
  { 
    id: 7, 
    name: 'Baling Twine', 
    category: 'Consumables', 
    quantity: 15, 
    unit: 'rolls', 
    minQuantity: 5, 
    price: 25,
    location: 'Equipment Storage',
    lastUpdated: '2023-07-05'
  }
];

const initialTransactionHistory = [
  { id: 1, itemId: 1, type: 'out', quantity: 5, date: '2023-08-20', user: 'John Smith', notes: 'Safety training session' },
  { id: 2, itemId: 2, type: 'out', quantity: 200, date: '2023-08-18', user: 'John Smith', notes: 'Field application east section' },
  { id: 3, itemId: 4, type: 'in', quantity: 500, date: '2023-08-18', user: 'Mary Johnson', notes: 'Monthly delivery' },
  { id: 4, itemId: 3, type: 'out', quantity: 5, date: '2023-08-15', user: 'John Smith', notes: 'Weed control south field' },
  { id: 5, itemId: 1, type: 'in', quantity: 20, date: '2023-08-10', user: 'Mary Johnson', notes: 'Additional purchase' },
  { id: 6, itemId: 6, type: 'out', quantity: 5, date: '2023-08-05', user: 'Peter Wilson', notes: 'Tractor maintenance' },
];

const initialCategoryStats = [
  { name: 'PPE', value: 50, fill: '#4CAF50' },
  { name: 'Fertilizers', value: 800, fill: '#8D6E63' },
  { name: 'Chemicals', value: 50, fill: '#F44336' },
  { name: 'Fuels', value: 350, fill: '#2196F3' },
  { name: 'Lubricants', value: 25, fill: '#FFC107' },
  { name: 'Consumables', value: 15, fill: '#9C27B0' }
];

interface InventoryProps {
  dateRange?: DateRange;
  searchTerm?: string;
}

const Inventory: React.FC<InventoryProps> = ({ dateRange, searchTerm: externalSearchTerm }) => {
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [transactionHistory, setTransactionHistory] = useState(initialTransactionHistory);
  const [categoryStats, setCategoryStats] = useState(initialCategoryStats);
  
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minQuantity: 0,
    price: 0,
    location: '',
    notes: ''
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'stats'>('list');
  const [showTransactionForm, setShowTransactionForm] = useState<'in' | 'out' | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    quantity: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [transactionDeleteConfirmOpen, setTransactionDeleteConfirmOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);
  
  const generateAlerts = () => {
    return inventoryData
      .filter(item => item.quantity <= item.minQuantity)
      .map(item => ({
        id: item.id,
        name: item.name,
        current: item.quantity,
        min: item.minQuantity,
        status: item.quantity < item.minQuantity * 0.5 ? 'critical' as const : 'warning' as const
      }));
  };
  
  const alerts = generateAlerts();
  
  const filteredItems = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (categoryFilter === 'all') return matchesSearch;
      return matchesSearch && item.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'quantity') {
        return sortOrder === 'asc' 
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      } else if (sortBy === 'lastUpdated') {
        return sortOrder === 'asc'
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return 0;
    });
  
  const categories = ['all', ...new Set(inventoryData.map(item => item.category))];
  
  const handleExportData = () => {
    if (view === 'list') {
      exportInventoryToCSV(inventoryData);
    } else if (view === 'stats') {
      exportInventoryToPDF(inventoryData);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    importInventoryFromCSV(file, (importedData) => {
      const existingIds = new Set(inventoryData.map(item => item.id));
      const newItems = importedData.filter(item => !existingIds.has(item.id));
      const updatedItems = importedData.filter(item => existingIds.has(item.id));
      
      const updatedInventory = inventoryData.map(item => {
        const updatedItem = updatedItems.find(update => update.id === item.id);
        return updatedItem || item;
      });
      
      setInventoryData([...updatedInventory, ...newItems]);
      
      updateCategoryStats([...updatedInventory, ...newItems]);
    }, {
      onProgress: (progress) => {
        if (progress === 100) {
          toast.success("Import completed successfully");
        }
      }
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const updateCategoryStats = (items: typeof inventoryData) => {
    const categories: Record<string, number> = {};
    const colors: Record<string, string> = {};
    
    categoryStats.forEach(stat => {
      colors[stat.name] = stat.fill;
    });
    
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
        if (!colors[item.category]) {
          colors[item.category] = getRandomColor();
        }
      }
      categories[item.category] += item.quantity;
    });
    
    const newStats = Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      fill: colors[name]
    }));
    
    setCategoryStats(newStats);
  };
  
  const confirmDeleteItem = (id: number) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const handleDeleteItem = () => {
    if (itemToDelete === null) return;
    
    const itemToDeleteObj = inventoryData.find(item => item.id === itemToDelete);
    if (!itemToDeleteObj) return;
    
    setInventoryData(inventoryData.filter(item => item.id !== itemToDelete));
    
    setCategoryStats(categoryStats.map(stat => 
      stat.name === itemToDeleteObj.category 
        ? { ...stat, value: Math.max(0, stat.value - itemToDeleteObj.quantity) }
        : stat
    ));
    
    if (selectedItem && selectedItem.id === itemToDelete) {
      setSelectedItem(null);
    }
    
    toast.success(`${itemToDeleteObj.name} has been removed from inventory`);
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };
  
  const confirmDeleteTransaction = (id: number) => {
    setTransactionToDelete(id);
    setTransactionDeleteConfirmOpen(true);
  };
  
  const handleDeleteTransaction = () => {
    if (transactionToDelete === null || !selectedItem) return;
    
    const transaction = transactionHistory.find(t => t.id === transactionToDelete);
    if (!transaction) return;
    
    const updatedTransactions = transactionHistory.filter(t => t.id !== transactionToDelete);
    setTransactionHistory(updatedTransactions);
    
    const quantityChange = transaction.type === 'in' 
      ? -transaction.quantity 
      : transaction.quantity;
    
    handleUpdateItem(
      selectedItem.id, 
      'quantity', 
      Math.max(0, selectedItem.quantity + quantityChange)
    );
    
    toast.success("Transaction deleted and stock adjusted");
    setTransactionToDelete(null);
    setTransactionDeleteConfirmOpen(false);
  };
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.unit) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newId = Math.max(...inventoryData.map(item => item.id), 0) + 1;
    const itemToAdd = {
      ...newItem,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      quantity: Number(newItem.quantity),
      minQuantity: Number(newItem.minQuantity),
      price: Number(newItem.price)
    };
    
    setInventoryData([...inventoryData, itemToAdd]);
    
    const existingCategoryStat = categoryStats.find(stat => stat.name === newItem.category);
    if (existingCategoryStat) {
      setCategoryStats(categoryStats.map(stat => 
        stat.name === newItem.category 
          ? { ...stat, value: stat.value + Number(newItem.quantity) }
          : stat
      ));
    } else {
      setCategoryStats([...categoryStats, { 
        name: newItem.category, 
        value: Number(newItem.quantity),
        fill: getRandomColor()
      }]);
    }
    
    setShowAddForm(false);
    setNewItem({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minQuantity: 0,
      price: 0,
      location: '',
      notes: ''
    });
    
    toast.success(`${newItem.name} has been added to inventory`);
  };
  
  const getRandomColor = () => {
    const colors = ['#4CAF50', '#8D6E63', '#F44336', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', '#3F51B5'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const handleUpdateItem = (id: number, field: string, value: any) => {
    setInventoryData(inventoryData.map(item => {
      if (item.id !== id) return item;
      
      const updatedItem = { 
        ...item, 
        [field]: value,
        lastUpdated: new Date().toISOString().split('T')[0] 
      };
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(updatedItem);
      }
      
      return updatedItem;
    }));
    
    if (field === 'quantity') {
      const item = inventoryData.find(item => item.id === id);
      if (item) {
        const oldQuantity = item.quantity;
        const newQuantity = value;
        const diff = newQuantity - oldQuantity;
        
        setCategoryStats(categoryStats.map(stat => 
          stat.name === item.category 
            ? { ...stat, value: stat.value + diff }
            : stat
        ));
      }
    }
  };
  
  const handleAddTransaction = (type: 'in' | 'out') => {
    setShowTransactionForm(type);
  };
  
  const handleSubmitTransaction = () => {
    if (!selectedItem || !showTransactionForm || newTransaction.quantity <= 0) {
      toast.error("Please specify a valid quantity");
      return;
    }
    
    const newId = Math.max(...transactionHistory.map(t => t.id), 0) + 1;
    const transaction = {
      id: newId,
      itemId: selectedItem.id,
      type: showTransactionForm,
      quantity: newTransaction.quantity,
      date: newTransaction.date,
      user: 'Current User',
      notes: newTransaction.notes
    };
    
    setTransactionHistory([transaction, ...transactionHistory]);
    
    const updatedQuantity = showTransactionForm === 'in' 
      ? selectedItem.quantity + newTransaction.quantity 
      : Math.max(0, selectedItem.quantity - newTransaction.quantity);
    
    handleUpdateItem(selectedItem.id, 'quantity', updatedQuantity);
    
    setShowTransactionForm(null);
    setNewTransaction({
      quantity: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    toast.success(`${newTransaction.quantity} ${selectedItem.unit} ${showTransactionForm === 'in' ? 'added' : 'removed'} from inventory`);
  };
  
  const itemTransactions = selectedItem 
    ? transactionHistory.filter(t => t.itemId === selectedItem.id).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  const inventoryColumns: Column[] = [
    { id: 'name', header: 'Item Name', accessorKey: 'name', isEditable: true },
    { id: 'category', header: 'Category', accessorKey: 'category', isEditable: true },
    { id: 'quantity', header: 'Quantity', accessorKey: 'quantity', type: 'number', isEditable: true },
    { id: 'price', header: 'Unit Price', accessorKey: 'price', type: 'number', isEditable: true },
    { id: 'value', header: 'Total Value', accessorKey: 'value', type: 'text', isEditable: false },
    { id: 'status', header: 'Status', accessorKey: 'status', type: 'text', isEditable: false },
  ];

  const tableData = filteredItems.map(item => ({
    ...item,
    value: `$${(item.quantity * item.price).toFixed(2)}`,
    status: item.quantity <= item.minQuantity 
      ? item.quantity < item.minQuantity * 0.5 ? 'critical' : 'warning'
      : 'normal'
  }));

  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const item = filteredItems[rowIndex];
    if (!item) return;
    
    handleUpdateItem(item.id, columnId, value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, action: Function) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="animate-enter">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Stock Management</h1>
          <p className="text-muted-foreground">Manage your inventory and track stock levels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            className="px-4 py-2"
          >
            List View
          </Button>
          <Button 
            variant={view === 'stats' ? 'default' : 'outline'}
            onClick={() => setView('stats')}
            className="px-4 py-2"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Statistics
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportData}
            className="px-4 py-2"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="relative">
            <Button 
              variant="outline"
              onClick={handleImportClick}
              className="px-4 py-2"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv"
              className="hidden" 
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="ml-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </header>

      <InventoryAlerts 
        alerts={alerts} 
        onQuantityChange={handleUpdateItem} 
      />

      {view === 'list' ? (
        selectedItem ? (
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-green-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="mr-3 hover:bg-white/10 p-1 rounded"
                  aria-label="Back to list"
                >
                  <ChevronRight className="h-5 w-5 transform rotate-180" />
                </button>
                <EditableField 
                  value={selectedItem.name}
                  onSave={(value) => handleUpdateItem(selectedItem.id, 'name', value)}
                  className="text-xl font-semibold"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => handleAddTransaction('in')}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-none"
                >
                  <ArrowDown className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Stock In</span>
                </Button>
                <Button 
                  onClick={() => handleAddTransaction('out')}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-none"
                >
                  <ArrowUp className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Stock Out</span>
                </Button>
                <Button 
                  onClick={() => confirmDeleteItem(selectedItem.id)}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-none"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Item Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category:</span>
                      <EditableField
                        value={selectedItem.category}
                        onSave={(value) => handleUpdateItem(selectedItem.id, 'category', value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quantity:</span>
                      <div className="flex items-center">
                        <EditableField
                          value={selectedItem.quantity}
                          type="number"
                          onSave={(value) => handleUpdateItem(selectedItem.id, 'quantity', Number(value))}
                          className="font-medium"
                        />
                        <EditableField
                          value={selectedItem.unit}
                          onSave={(value) => handleUpdateItem(selectedItem.id, 'unit', value)}
                          className="ml-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Minimum Quantity:</span>
                      <div className="flex items-center">
                        <EditableField
                          value={selectedItem.minQuantity}
                          type="number"
                          onSave={(value) => handleUpdateItem(selectedItem.id, 'minQuantity', Number(value))}
                        />
                        <span className="ml-1">{selectedItem.unit}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Unit Price:</span>
                      <div className="flex items-center">
                        <EditableField
                          value={selectedItem.price}
                          type="number"
                          onSave={(value) => handleUpdateItem(selectedItem.id, 'price', Number(value))}
                        />
                        <span className="ml-1">€/{selectedItem.unit}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Value:</span>
                      <span className="font-medium">{(selectedItem.quantity * selectedItem.price).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Location:</span>
                      <EditableField
                        value={selectedItem.location}
                        onSave={(value) => handleUpdateItem(selectedItem.id, 'location', value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(selectedItem.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Statistics</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Current Stock', value: selectedItem.quantity },
                          { name: 'Minimum Quantity', value: selectedItem.minQuantity }
                        ]}
                        margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} ${selectedItem.unit}`, '']} />
                        <Bar 
                          dataKey="value" 
                          fill="#4CAF50" 
                          radius={[4, 4, 0, 0]}
                          fillOpacity={1}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {showTransactionForm && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/10">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      {showTransactionForm === 'in' ? 'New Stock In' : 'New Stock Out'}
                    </h3>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowTransactionForm(null)}
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex items-center mt-1">
                        <Input
                          id="quantity"
                          type="number"
                          value={newTransaction.quantity}
                          onChange={(e) => setNewTransaction({
                            ...newTransaction,
                            quantity: parseInt(e.target.value) || 0
                          })}
                          min={0}
                        />
                        <span className="ml-2">{selectedItem.unit}</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction,
                          date: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={newTransaction.notes}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction,
                          notes: e.target.value
                        })}
                        placeholder="Comments..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTransactionForm(null)}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitTransaction}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t">
                          <td className="px-4 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'in' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.type === 'in' ? (
                                <>
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                  Stock In
                                </>
                              ) : (
                                <>
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                  Stock Out
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3">{transaction.quantity} {selectedItem.unit}</td>
                          <td className="px-4 py-3">{transaction.user}</td>
                          <td className="px-4 py-3">
                            <EditableField
                              value={transaction.notes}
                              onSave={(value) => {
                                const updatedTransactions = [...transactionHistory];
                                const index = updatedTransactions.findIndex(t => t.id === transaction.id);
                                if (index !== -1) {
                                  updatedTransactions[index] = {
                                    ...updatedTransactions[index],
                                    notes: value.toString()
                                  };
                                  setTransactionHistory(updatedTransactions);
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => confirmDeleteTransaction(transaction.id)}
                              className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                              title="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {itemTransactions.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                            No transactions recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <InventoryFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder as (order: 'asc' | 'desc') => void}
              />
            </div>
            
            <EditableTable
              data={tableData}
              columns={inventoryColumns}
              onUpdate={handleTableUpdate}
              onDelete={(rowIndex) => confirmDeleteItem(filteredItems[rowIndex].id)}
              actions={[
                { 
                  icon: <ChevronRight className="h-4 w-4" />,
                  label: "View Details",
                  onClick: (rowIndex) => setSelectedItem(filteredItems[rowIndex])
                }
              ]}
              className="mb-6"
              sortable={true}
            />
            
            {showAddForm && (
              <div className="border rounded-xl p-6 bg-muted/5 animate-enter">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add New Item</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name*</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="mt-1"
                      placeholder="Ex: Safety Helmets"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category*</Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="mt-1"
                      list="categories-list"
                      placeholder="Ex: Personal Protective Equipment"
                    />
                    <datalist id="categories-list">
                      {categories
                        .filter(cat => cat !== 'all')
                        .map((category) => (
                          <option key={category} value={category} />
                        ))}
                    </datalist>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Initial Quantity*</Label>
                    <div className="flex mt-1">
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        min={0}
                      />
                      <Input
                        className="w-24 ml-2"
                        placeholder="Unit"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="minQuantity">Minimum Quantity Alert</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      value={newItem.minQuantity}
                      onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                      className="mt-1"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Unit Price (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      className="mt-1"
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="mt-1"
                      placeholder="Ex: Safety Storage"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={newItem.notes || ''}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      className="mt-1"
                      placeholder="Additional information about the item..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)} 
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <InventoryStats 
          inventoryData={inventoryData} 
          categoryStats={categoryStats} 
        />
      )}

      <ConfirmDialog 
        open={deleteConfirmOpen} 
        title="Delete Item" 
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteItem}
        onOpenChange={() => setDeleteConfirmOpen(false)}
      />

      <ConfirmDialog 
        open={transactionDeleteConfirmOpen} 
        title="Delete Transaction" 
        description="Are you sure you want to delete this transaction? Stock will be adjusted accordingly."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteTransaction}
        onOpenChange={() => setTransactionDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Inventory;
