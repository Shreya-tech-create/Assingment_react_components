import React, { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Github, Sparkles, CheckCircle, Eye } from "lucide-react";

// Sample data for DataTable demo
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

const sampleUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", lastLogin: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", lastLogin: "2024-01-14" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Editor", status: "inactive", lastLogin: "2024-01-10" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "User", status: "pending", lastLogin: "2024-01-12" },
  { id: 5, name: "David Brown", email: "david@example.com", role: "Admin", status: "active", lastLogin: "2024-01-16" },
];

const userColumns: Column<User>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: true,
    render: (value) => (
      <Badge variant={value === 'Admin' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (value) => (
      <Badge 
        variant={
          value === 'active' ? 'default' : 
          value === 'inactive' ? 'destructive' : 
          'secondary'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: 'lastLogin',
    title: 'Last Login',
    dataIndex: 'lastLogin',
    sortable: true,
  },
];

export default function Index() {
  // InputField demo states
  const [basicInput, setBasicInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [invalidInput, setInvalidInput] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  
  // DataTable demo states
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoadingDemo(true);
    setTimeout(() => setLoadingDemo(false), 2000);
  };

  const handleTableLoadingDemo = () => {
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">React Components</h1>
               
              </div>
            </div>
      
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            React Components
          </h2>

        </div>

        {/* Components Showcase */}
        <div className="space-y-12">
          {/* InputField Component */}
          <section>
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  InputField Component
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="demo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="demo">Live Demo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="demo" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Examples */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Basic Variants</h4>
                        
                        <InputField
                          label="Outlined (Default)"
                          placeholder="Enter your name"
                          value={basicInput}
                          onChange={(e) => setBasicInput(e.target.value)}
                          variant="outlined"
                          showClearButton
                        />
                        
                        <InputField
                          label="Filled Variant"
                          placeholder="Enter your email"
                          variant="filled"
                          type="email"
                        />
                        
                        <InputField
                          label="Ghost Variant"
                          placeholder="Search..."
                          variant="ghost"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          showClearButton
                        />
                      </div>
                      
                      {/* Advanced Examples */}
                      <div className="space-y-4">    
                        <InputField
                          label="Password Field"
                          placeholder="Enter password"
                          type="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          showPasswordToggle
                          helperText="Use at least 8 characters"
                        />
                        
                        <InputField
                          label="Error State"
                          placeholder="Enter valid email"
                          value={invalidInput}
                          onChange={(e) => setInvalidInput(e.target.value)}
                          invalid
                          errorMessage="Please enter a valid email address"
                        />
                        
                        <div className="flex gap-2 items-end">
                          <InputField
                            label="Loading State"
                            placeholder="Processing..."
                            loading={loadingDemo}
                            disabled={loadingDemo}
                          />
                          <Button onClick={handleLoadingDemo} size="sm">
                            Loading
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />
                    
                    {/* Size Variants */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900">Size Variants</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="Small"
                          size="sm"
                          placeholder="Small input"
                        />
                        <InputField
                          label="Medium (Default)"
                          size="md"
                          placeholder="Medium input"
                        />
                        <InputField
                          label="Large"
                          size="lg"
                          placeholder="Large input"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* DataTable Component */}
          <section>
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  DataTable Component
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="demo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="demo">Live Demo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="demo" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">User Management Table</h4>
                          <p className="text-sm text-slate-600">
                            
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handleTableLoadingDemo}
                          disabled={tableLoading}
                        >
                          {tableLoading ? "Loading..." : "Loading State"}
                        </Button>
                      </div>
                      
                      <DataTable
                        data={sampleUsers}
                        columns={userColumns}
                        loading={tableLoading}
                        selectable
                        onRowSelect={setSelectedUsers}
                        className="border rounded-lg"
                      />
                      
                      {selectedUsers.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">Selected Users:</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedUsers.map(user => (
                              <Badge key={user.id} variant="secondary">
                                {user.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
