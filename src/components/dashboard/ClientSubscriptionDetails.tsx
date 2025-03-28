import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Download, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { useQuery } from "react-query";

export const ClientSubscriptionDetails = () => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data, isLoading: isLoadingQuery, error } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await api.subscription.getSubscription();
      return response;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch subscription details");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSubscription(data);
    }
  }, [data]);

  if (isLoadingQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No subscription found. Please contact support.</p>
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="billing">Billing History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Current Plan</CardTitle>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{subscription.plan}</h3>
                  <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                    {subscription.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  ${subscription.price}/{subscription.billingCycle}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Next billing: {subscription.nextBillingDate}
                </div>
                
                <div className="pt-4">
                  <h4 className="mb-2 font-medium">Included in your plan:</h4>
                  <ul className="space-y-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full mt-4" onClick={() => setIsUpgrading(true)}>
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {isUpgrading ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upgrade Options</CardTitle>
                <CardDescription>Select a new plan to upgrade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Business</h3>
                      <Badge>Recommended</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">$99.99<span className="text-sm font-normal">/month</span></div>
                    <p className="text-sm text-muted-foreground mb-4">For growing businesses with advanced needs</p>
                    <Button className="w-full">Select Plan</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Enterprise</h3>
                      <Badge variant="outline">Custom</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">Custom<span className="text-sm font-normal">/month</span></div>
                    <p className="text-sm text-muted-foreground mb-4">For large organizations with specific requirements</p>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </div>
                  
                  <Button variant="ghost" onClick={() => setIsUpgrading(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Usage Summary</CardTitle>
                <CardDescription>Current usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Conversations</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.conversations.used} / {subscription.usage.conversations.limit}
                      </span>
                    </div>
                    <Progress value={(subscription.usage.conversations.used / Number(subscription.usage.conversations.limit)) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">API Calls</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.apiCalls.used} / {subscription.usage.apiCalls.limit}
                      </span>
                    </div>
                    <Progress value={(subscription.usage.apiCalls.used / Number(subscription.usage.apiCalls.limit)) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Storage (MB)</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.storage.used} / {subscription.usage.storage.limit}
                      </span>
                    </div>
                    <Progress value={(subscription.usage.storage.used / Number(subscription.usage.storage.limit)) * 100} />
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a href="#usage">
                        <BarChart className="mr-2 h-4 w-4" />
                        View Detailed Usage
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="usage">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>
              Monitor your usage across all plan resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Chatbots</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Used: {subscription.usage.chatbots.used}</span>
                  <span className="text-sm text-muted-foreground">Limit: {subscription.usage.chatbots.limit}</span>
                </div>
                {subscription.usage.chatbots.limit !== 'Unlimited' && (
                  <Progress value={(subscription.usage.chatbots.used / Number(subscription.usage.chatbots.limit)) * 100} />
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Conversations</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Used: {subscription.usage.conversations.used}</span>
                  <span className="text-sm text-muted-foreground">Limit: {subscription.usage.conversations.limit}</span>
                </div>
                <Progress value={(subscription.usage.conversations.used / Number(subscription.usage.conversations.limit)) * 100} />
                {subscription.usage.conversations.used > Number(subscription.usage.conversations.limit) * 0.8 && (
                  <p className="text-amber-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    You're approaching your limit. Consider upgrading your plan.
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">API Calls</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Used: {subscription.usage.apiCalls.used}</span>
                  <span className="text-sm text-muted-foreground">Limit: {subscription.usage.apiCalls.limit}</span>
                </div>
                <Progress value={(subscription.usage.apiCalls.used / Number(subscription.usage.apiCalls.limit)) * 100} />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Storage (MB)</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Used: {subscription.usage.storage.used}</span>
                  <span className="text-sm text-muted-foreground">Limit: {subscription.usage.storage.limit}</span>
                </div>
                <Progress value={(subscription.usage.storage.used / Number(subscription.usage.storage.limit)) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View and download your past invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscription.billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                          {invoice.status === "paid" ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Payment Method</h3>
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-muted rounded-md">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  <Button variant="link" className="px-0 h-auto text-sm">Update payment method</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ClientSubscriptionDetails;
