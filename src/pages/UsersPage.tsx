
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Users, Shield, Settings, Plus, Search } from 'lucide-react';
import usePageMetadata from '../hooks/use-page-metadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'User Management',
    defaultDescription: 'Manage user accounts, roles, and access permissions for the inventory system'
  });

  // Sample users data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'admin@inventory.com',
      role: 'Store Manager',
      department: 'Operations',
      status: 'Active',
      lastLogin: '2024-06-15T09:30:00',
      permissions: ['Full Access', 'Reports', 'User Management']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'hse@inventory.com',
      role: 'HSE Officer',
      department: 'Health & Safety',
      status: 'Active',
      lastLogin: '2024-06-14T16:45:00',
      permissions: ['Safety Monitoring', 'Expiry Tracking', 'Compliance Reports']
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'maint@inventory.com',
      role: 'Maintenance Team',
      department: 'Maintenance',
      status: 'Active',
      lastLogin: '2024-06-15T07:15:00',
      permissions: ['Item Request', 'Issue Items', 'Return Items']
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa.chen@inventory.com',
      role: 'HSE Officer',
      department: 'Health & Safety',
      status: 'Inactive',
      lastLogin: '2024-05-28T11:20:00',
      permissions: ['Safety Monitoring', 'Expiry Tracking']
    }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    console.log('Add new user functionality');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Store Manager':
        return 'bg-blue-100 text-blue-800';
      case 'HSE Officer':
        return 'bg-green-100 text-green-800';
      case 'Maintenance Team':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderActions = () => {
    return (
      <Button 
        onClick={handleAddUser} 
        className="whitespace-nowrap bg-green-600 hover:bg-green-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
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
            placeholder="Search users..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
          icon={<Users className="h-6 w-6" />}
          filterArea={renderFilterArea()}
        />

        {/* User Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-green-700">
                    {users.filter(u => u.status === 'Active').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Roles</p>
                  <p className="text-2xl font-bold text-purple-700">3</p>
                </div>
                <Settings className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="mt-6 grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Login</p>
                    <p className="font-medium">{new Date(user.lastLogin).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Permissions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit User
                  </Button>
                  <Button size="sm" variant="outline">
                    Reset Password
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="mt-8 text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-500">No users match your search criteria.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UsersPage;
