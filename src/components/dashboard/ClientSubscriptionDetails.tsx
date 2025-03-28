
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, CreditCard, Calendar, Clock, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const ClientSubscriptionDetails = () => {
  const { toast } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  // Mock data - replace with actual API calls in production
  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => {
      // In a real environment, this would call the API
      return {
        id: 'sub_1234567890',
        status: 'active',
        currentPlan: {
          name: 'Pro',
          price: '$29/month',
          nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          features: ['5 chatbots', '1,000 API calls/month', '10GB storage', 'Priority support']
        },
        usage: {
          chatbots: {
            used: 3,
            limit: 5
          },
          apiCalls: {
            used: 750,
            limit: 1000
          },
          storage: {
            used: 4.2,
            limit: 10
          }
        },
        invoices: [
          {
            id: 'inv_123456',
            amount: '$29.00',
            status: 'paid',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'inv_123455',
            amount: '$29.00',
            status: 'paid',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'inv_123454',
            amount: '$29.00',
            status: 'paid',
            date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        ],
        paymentMethod: {
          brand: 'Visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025
        }
      };
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This will downgrade your account at the end of your billing period.')) {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled and will end on your next billing date.",
      });
    }
  };
  
  const handleUpdatePaymentMethod = () => {
    // This would open a payment method update modal in a real app
    toast({
      title: "Not Implemented",
      description: "This feature is not implemented in the demo.",
    });
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Download Started",
      description: `Your invoice #${invoiceId} download has started.`,
    });
    // In a real app, this would trigger a download
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-48">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Loading subscription details...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-48">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
              <p className="mb-2">Sorry, we couldn't load your subscription details.</p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and view usage statistics
            </CardDescription>
          </div>
          <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
            {subscription.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{subscription.currentPlan.name} Plan</h3>
                    <p className="text-sm text-muted-foreground">{subscription.currentPlan.price}</p>
                  </div>
                  <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
                    <DialogTrigger asChild>
                      <Button>Upgrade Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade Your Plan</DialogTitle>
                        <DialogDescription>
                          Choose a plan that works best for your needs.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Plan selection would go here */}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          setIsUpgradeModalOpen(false);
                          toast({
                            title: "Plan Upgraded",
                            description: "Your plan has been upgraded successfully.",
                          });
                        }}>
                          Confirm Upgrade
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Next billing date: {format(subscription.currentPlan.nextBillingDate, 'MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Payment method: {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Plan includes:</p>
                  <ul className="space-y-1">
                    {subscription.currentPlan.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={handleUpdatePaymentMethod}>
                  Update Payment Method
                </Button>
                <Button variant="destructive" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Resource Usage</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Chatbots</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.chatbots.used} of {subscription.usage.chatbots.limit} used
                      </span>
                    </div>
                    <Progress value={(subscription.usage.chatbots.used / subscription.usage.chatbots.limit) * 100} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">API Calls</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.apiCalls.used} of {subscription.usage.apiCalls.limit} used
                      </span>
                    </div>
                    <Progress value={(subscription.usage.apiCalls.used / subscription.usage.apiCalls.limit) * 100} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usage.storage.used}GB of {subscription.usage.storage.limit}GB used
                      </span>
                    </div>
                    <Progress value={(subscription.usage.storage.used / subscription.usage.storage.limit) * 100} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Usage Data
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="space-y-6">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscription.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{format(invoice.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'paid' ? 'outline' : 'destructive'}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientSubscriptionDetails;
