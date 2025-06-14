
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, AlertTriangle, TrendingUp, Search, Plus } from 'lucide-react';

const InventoryTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryData = [
    {
      id: 1,
      name: 'Safety Helmets',
      category: 'PPE',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'pieces',
      status: 'In Stock',
      lastUpdated: '2024-06-15'
    },
    {
      id: 2,
      name: 'Chemical Gloves',
      category: 'PPE',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'pairs',
      status: 'Low Stock',
      lastUpdated: '2024-06-14'
    },
    {
      id: 3,
      name: 'First Aid Kits',
      category: 'Medical',
      currentStock: 3,
      minStock: 10,
      maxStock: 25,
      unit: 'kits',
      status: 'Critical',
      lastUpdated: '2024-06-13'
    },
    {
      id: 4,
      name: 'Fire Extinguishers',
      category: 'Safety Equipment',
      currentStock: 25,
      minStock: 20,
      maxStock: 40,
      unit: 'units',
      status: 'In Stock',
      lastUpdated: '2024-06-15'
    }
  ];

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

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const filteredInventory = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Tracking</h2>
          <p className="text-gray-600">Monitor stock levels and manage inventory</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Input 
              placeholder="Search inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryData.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">In Stock</p>
                <p className="text-2xl font-bold text-green-700">
                  {inventoryData.filter(i => i.status === 'In Stock').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {inventoryData.filter(i => i.status === 'Low Stock').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-700">
                  {inventoryData.filter(i => i.status === 'Critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Current Stock</p>
                  <p className="font-medium">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Min Stock</p>
                  <p className="font-medium">{item.minStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stock Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        getStockPercentage(item.currentStock, item.maxStock) > 50 
                          ? 'bg-green-500' 
                          : getStockPercentage(item.currentStock, item.maxStock) > 25 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(getStockPercentage(item.currentStock, item.maxStock))}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{item.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
          <p className="text-gray-500">No inventory items match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTracking;
