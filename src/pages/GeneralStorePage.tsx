
import React, { useState, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Download, Plus, Upload, FileUp, FileDown, Archive, Search, AlertTriangle, Package, Calendar } from 'lucide-react';
import { DatePickerWithRange } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { useToast } from "@/hooks/use-toast";
import usePageMetadata from '../hooks/use-page-metadata';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GeneralStorePage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'General Store Inventory',
    defaultDescription: 'Manage office supplies, maintenance equipment, and general workplace materials'
  });

  // HSE-focused general store inventory data
  const generalStoreItems = [
    {
      id: 1,
      name: 'A4 Copy Paper',
      category: 'Office Supplies',
      quantity: 250,
      unit: 'sheets',
      minStock: 100,
      supplier: 'Office Supply Co.',
      lastOrdered: '2024-05-15',
      status: 'In Stock',
      location: 'Storage Room A',
      expiryDate: 'N/A'
    },
    {
      id: 2,
      name: 'Steel Bolts M8x25mm',
      category: 'Hardware & Fasteners',
      quantity: 85,
      unit: 'pieces',
      minStock: 50,
      supplier: 'Industrial Hardware Ltd.',
      lastOrdered: '2024-04-20',
      status: 'In Stock',
      location: 'Maintenance Workshop',
      expiryDate: 'N/A'
    },
    {
      id: 3,
      name: 'Industrial Cleaning Detergent',
      category: 'Cleaning Supplies',
      quantity: 12,
      unit: 'bottles',
      minStock: 20,
      supplier: 'SafeClean Industries',
      lastOrdered: '2024-03-10',
      status: 'Low Stock',
      location: 'Cleaning Storage',
      expiryDate: '2025-03-15'
    },
    {
      id: 4,
      name: 'Emergency First Aid Supplies',
      category: 'Medical & Safety',
      quantity: 5,
      unit: 'kits',
      minStock: 15,
      supplier: 'MedSafe Solutions',
      lastOrdered: '2024-02-28',
      status: 'Critical',
      location: 'Medical Storage',
      expiryDate: '2024-12-31'
    },
    {
      id: 5,
      name: 'LED Emergency Flashlights',
      category: 'Safety Equipment',
      quantity: 30,
      unit: 'pieces',
      minStock: 25,
      supplier: 'Safety Tech Corp.',
      lastOrdered: '2024-04-05',
      status: 'In Stock',
      location: 'Safety Equipment Room',
      expiryDate: 'N/A'
    },
    {
      id: 6,
      name: 'Spillage Absorbent Mats',
      category: 'Spill Control',
      quantity: 8,
      unit: 'packs',
      minStock: 15,
      supplier: 'Environmental Safety Ltd.',
      lastOrdered: '2024-01-15',
      status: 'Low Stock',
      location: 'Spill Response Area',
      expiryDate: 'N/A'
    }
  ];

  const handleExportData = () => {
    console.log("Exporting general store inventory data");
    toast({
      title: "Export Started",
      description: "General store inventory data is being exported to CSV format...",
    });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`Importing general store inventory from ${file.name}`);
    toast({
      title: "Import Started",
      description: `Processing inventory data from ${file.name}...`,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = () => {
    console.log('Opening form to add new general store item');
    toast({
      title: "Add New Item",
      description: "Opening form to add new general store item...",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Office Supplies': 'bg-blue-100 text-blue-800',
      'Hardware & Fasteners': 'bg-gray-100 text-gray-800',
      'Cleaning Supplies': 'bg-purple-100 text-purple-800',
      'Medical & Safety': 'bg-pink-100 text-pink-800',
      'Safety Equipment': 'bg-orange-100 text-orange-800',
      'Spill Control': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredItems = generalStoreItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap border-green-200 hover:bg-green-50">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              Export Inventory Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap border-green-200 hover:bg-green-50">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
            <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" />
              Import from CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv"
          className="hidden" 
        />
        
        <Button 
          onClick={handleAddItem} 
          className="whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>
    );
  };

  const renderFilterArea = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-3 w-full"
      >
        <div className="relative flex-grow">
          <Input 
            placeholder="Search items, categories, or suppliers..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 border-green-200 focus:border-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full md:w-[300px]">
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            placeholderText="Filter by order date range"
            align="end"
          />
        </div>
      </motion.div>
    );
  };

  // Statistics for the dashboard
  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;
  const criticalItems = filteredItems.filter(item => item.status === 'Critical').length;

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderActions()}
          icon={<Archive className="h-6 w-6 text-green-600" />}
          filterArea={renderFilterArea()}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical Items</p>
                  <p className="text-2xl font-bold text-gray-900">{criticalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Items Grid */}
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">{item.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Current Stock</p>
                    <p className="font-semibold text-gray-900">{item.quantity} {item.unit}</p>
                    <p className="text-xs text-gray-400">Min required: {item.minStock}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Supplier</p>
                    <p className="font-semibold text-gray-900">{item.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Location</p>
                    <p className="font-semibold text-gray-900">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Last Ordered</p>
                    <p className="font-semibold text-gray-900">{item.lastOrdered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Stock Level</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.quantity > item.minStock ? 'bg-green-500' : 
                        item.quantity > item.minStock * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs font-medium">
                        {Math.round((item.quantity / item.minStock) * 100)}% of minimum
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredItems.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
                <p className="text-gray-600">No general store items match your current search criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default GeneralStorePage;
