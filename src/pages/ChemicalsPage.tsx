
import React, { useState, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Download, Plus, Upload, FileUp, FileDown, Beaker, Search, AlertTriangle } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChemicalsPage = () => {
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
    defaultTitle: 'Chemical Inventory Management',
    defaultDescription: 'Manage chemical substances, hazardous materials, and safety compliance tracking'
  });

  // Sample chemicals data
  const chemicalItems = [
    {
      id: 1,
      name: 'Hydrochloric Acid (HCl)',
      category: 'Corrosive',
      quantity: 25.5,
      unit: 'liters',
      concentration: '37%',
      hazardClass: 'Class 8',
      expiryDate: '2024-09-15',
      supplier: 'ChemSupply Ltd',
      status: 'Expires Soon',
      msdsAvailable: true
    },
    {
      id: 2,
      name: 'Sodium Hydroxide (NaOH)',
      category: 'Caustic',
      quantity: 50,
      unit: 'kg',
      concentration: '99%',
      hazardClass: 'Class 8',
      expiryDate: '2025-03-20',
      supplier: 'Industrial Chemicals Inc',
      status: 'In Stock',
      msdsAvailable: true
    },
    {
      id: 3,
      name: 'Acetone',
      category: 'Solvent',
      quantity: 2.8,
      unit: 'liters',
      concentration: '100%',
      hazardClass: 'Class 3',
      expiryDate: '2024-07-10',
      supplier: 'PureChem Solutions',
      status: 'Low Stock',
      msdsAvailable: false
    }
  ];

  const handleExportData = () => {
    console.log("Export chemicals inventory data");
    toast({
      title: "Export Started",
      description: "Chemical inventory data is being exported...",
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

    console.log(`Importing chemical data from ${file.name}`);
    toast({
      title: "Import Started",
      description: `Processing ${file.name}...`,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = () => {
    console.log('Add new chemical item functionality');
    toast({
      title: "Add Chemical",
      description: "Opening form to add new chemical item...",
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
      case 'Expires Soon':
        return 'bg-orange-100 text-orange-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHazardColor = (hazardClass: string) => {
    switch (hazardClass) {
      case 'Class 3':
        return 'bg-red-100 text-red-800';
      case 'Class 8':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              Export Safety Report
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
          Add Chemical
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
            placeholder="Search chemicals..." 
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
            placeholderText="Filter by expiry date"
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
          icon={<Beaker className="h-6 w-6" />}
          filterArea={renderFilterArea()}
        />

        <Alert className="mt-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Always follow proper safety protocols when handling chemicals. Ensure MSDS sheets are available and up to date.
          </AlertDescription>
        </Alert>

        <div className="mt-6 grid gap-4">
          {chemicalItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getHazardColor(item.hazardClass)}>
                      {item.hazardClass}
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
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Concentration</p>
                    <p className="font-medium">{item.concentration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expiry Date</p>
                    <p className="font-medium">{item.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">MSDS Available</p>
                    <Badge className={item.msdsAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {item.msdsAvailable ? 'Yes' : 'Missing'}
                    </Badge>
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

export default ChemicalsPage;
