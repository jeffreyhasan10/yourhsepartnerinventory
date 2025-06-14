
import React, { useState, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Download, Plus, Upload, FileUp, FileDown, Archive, Search } from 'lucide-react';
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
    defaultDescription: 'Manage general supplies, office materials, and miscellaneous store items'
  });

  // Sample general store data
  const generalStoreItems = [
    {
      id: 1,
      name: 'A4 Copy Paper',
      category: 'Office Supplies',
      quantity: 45,
      unit: 'reams',
      minStock: 20,
      supplier: 'Office Depot',
      lastOrdered: '2024-05-15',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Steel Bolts M8x25',
      category: 'Hardware',
      quantity: 150,
      unit: 'pieces',
      minStock: 100,
      supplier: 'Hardware Solutions',
      lastOrdered: '2024-04-10',
      status: 'In Stock'
    },
    {
      id: 3,
      name: 'Cleaning Detergent',
      category: 'Cleaning Supplies',
      quantity: 8,
      unit: 'bottles',
      minStock: 15,
      supplier: 'CleanPro Industries',
      lastOrdered: '2024-03-20',
      status: 'Low Stock'
    },
    {
      id: 4,
      name: 'First Aid Kit Refills',
      category: 'Medical Supplies',
      quantity: 3,
      unit: 'kits',
      minStock: 10,
      supplier: 'MedCare Supplies',
      lastOrdered: '2024-02-28',
      status: 'Critical'
    }
  ];

  const handleExportData = () => {
    console.log("Export general store inventory data");
    toast({
      title: "Export Started",
      description: "General store inventory data is being exported...",
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

    console.log(`Importing general store data from ${file.name}`);
    toast({
      title: "Import Started",
      description: `Processing ${file.name}...`,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = () => {
    console.log('Add new general store item functionality');
    toast({
      title: "Add Store Item",
      description: "Opening form to add new store item...",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Office Supplies': 'bg-blue-100 text-blue-800',
      'Hardware': 'bg-gray-100 text-gray-800',
      'Cleaning Supplies': 'bg-purple-100 text-purple-800',
      'Medical Supplies': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              Export Inventory Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
            <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" />
              Import CSV
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
          className="whitespace-nowrap bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
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
            placeholder="Search store items..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full md:w-[300px]">
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            placeholderText="Filter by order date"
            align="end"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderActions()}
          icon={<Archive className="h-6 w-6" />}
          filterArea={renderFilterArea()}
        />

        <div className="mt-6 grid gap-4">
          {generalStoreItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Stock Level</p>
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                    <p className="text-xs text-gray-400">Min: {item.minStock}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Supplier</p>
                    <p className="font-medium">{item.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Ordered</p>
                    <p className="font-medium">{item.lastOrdered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Stock Status</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.quantity > item.minStock ? 'bg-green-500' : 
                        item.quantity > item.minStock * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs">{Math.round((item.quantity / item.minStock) * 100)}% of min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default GeneralStorePage;
