
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Edit, Mail, MessageSquare, Phone, User, Database, FileText } from "lucide-react";

export type UserDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    chatbots: number;
    joined: string;
    phone?: string;
    company?: string;
    plan?: string;
    nextBilling?: string;
    usageData?: {
      apiQuota: number;
      apiUsed: number;
      storageQuota: number;
      storageUsed: number;
      chatbotsQuota: number;
    };
  } | null;
};

export function UserDetailsModal({ open, onOpenChange, user }: UserDetailsModalProps) {
  if (!user) return null;

  // Calculate usage percentages if available
  const apiUsagePercentage = user.usageData ? Math.round((user.usageData.apiUsed / user.usageData.apiQuota) * 100) : 0;
  const storageUsagePercentage = user.usageData ? Math.round((user.usageData.storageUsed / user.usageData.storageQuota) * 100) : 0;
  const chatbotsUsagePercentage = user.usageData ? Math.round((user.chatbots / user.usageData.chatbotsQuota) * 100) : 0;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View and manage user information
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg border border-border">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-center">{user.name}</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">{user.email}</p>
              
              <Badge 
                variant={user.status === "active" ? "default" : "secondary"}
                className={user.status === "active" ? "bg-green-500 mb-4" : "bg-gray-500 mb-4"}
              >
                {user.status === "active" ? "Active" : "Inactive"}
              </Badge>
              
              <div className="w-full mt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full flex gap-2 justify-center">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="w-full flex gap-2 justify-center">
                  <Edit className="h-4 w-4" />
                  Edit User
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                <TabsTrigger value="subscription" className="flex-1">Subscription</TabsTrigger>
                <TabsTrigger value="usage" className="flex-1">Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.company && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium">{user.company}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Join Date</p>
                        <p className="font-medium">{new Date(user.joined).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscription" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.plan ? (
                      <>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Current Plan</p>
                            <p className="font-medium">{user.plan}</p>
                          </div>
                        </div>
                        
                        {user.nextBilling && (
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">Next Billing</p>
                              <p className="font-medium">{user.nextBilling}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm">
                            Manage Subscription
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">No active subscription</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="usage" className="space-y-4 mt-4">
                {user.usageData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Usage</CardTitle>
                      <CardDescription>Current usage of available resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">API Calls</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.usageData.apiUsed.toLocaleString()} / {user.usageData.apiQuota.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={apiUsagePercentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Storage</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.usageData.storageUsed} GB / {user.usageData.storageQuota} GB
                          </span>
                        </div>
                        <Progress value={storageUsagePercentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Chatbots</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.chatbots} / {user.usageData.chatbotsQuota}
                          </span>
                        </div>
                        <Progress value={chatbotsUsagePercentage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-6">
                      <p className="text-muted-foreground text-center">No usage data available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
