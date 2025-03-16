
import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIKeyManagement } from "@/components/admin/APIKeyManagement";
import { UsageStats } from "@/components/admin/UsageStats";
import { UserManagement } from "@/components/admin/UserManagement";
import { SubscriptionDetails } from "@/components/admin/SubscriptionDetails";
import { SalesAnalytics } from "@/components/admin/SalesAnalytics";
import api from "@/services/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminAuthenticated") === "true";
    
    if (!isAdmin) {
      navigate("/admin-sign-in");
      return;
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | AI Chatbot Platform</title>
      </Helmet>

      <Routes>
        <Route 
          path="/" 
          element={<DashboardOverview />} 
        />
        <Route 
          path="/api-keys" 
          element={<APIKeyManagement />} 
        />
        <Route 
          path="/users" 
          element={<UserManagement />} 
        />
        <Route 
          path="/analytics" 
          element={<AnalyticsView />} 
        />
        <Route 
          path="/settings" 
          element={<SettingsView />} 
        />
        <Route 
          path="/sales" 
          element={<SalesAnalytics />} 
        />
      </Routes>
    </AdminLayout>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeChatbots: 0,
    apiRequests: 0,
    userGrowth: 0,
    chatbotGrowth: 0,
    apiGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Note: using the new method we added to the API service
        const response = await api.admin.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          // Handle case where success is false but no error property exists
          const errorMessage = response.message || "Failed to fetch dashboard statistics";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage platform settings, API keys, and user accounts
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 animate-pulse bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 animate-pulse bg-muted rounded"></div>
                    <div className="h-4 w-32 animate-pulse bg-muted rounded mt-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.userGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeChatbots}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.chatbotGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.apiRequests.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.apiGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
          <UsageStats />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionDetails />
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesAnalytics />
        </TabsContent>
      </Tabs>
    </>
  );
};

const AnalyticsView = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analytics for platform usage and performance
        </p>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <UsageStats />
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <SalesAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SettingsView = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>
            Configure general platform settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings content will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
