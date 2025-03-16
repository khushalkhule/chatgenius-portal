
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Database, Download, FileText, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock subscription data for demonstration
const subscriptionData = {
  plan: "Pro",
  status: "Active",
  nextBilling: "May 15, 2024",
  apiQuota: 100000,
  apiUsed: 43210,
  storageQuota: 50, // in GB
  storageUsed: 12.5, // in GB
  chatbotsQuota: 50,
  chatbotsUsed: 12,
  features: [
    "50 chatbots",
    "100,000 API calls/month",
    "50GB storage",
    "Team collaboration",
    "Advanced analytics",
    "White-label chatbots"
  ],
  invoices: [
    { id: "INV-2024-0412", date: "Apr 12, 2024", amount: "$49.99", status: "Paid" },
    { id: "INV-2024-0312", date: "Mar 12, 2024", amount: "$49.99", status: "Paid" },
    { id: "INV-2024-0212", date: "Feb 12, 2024", amount: "$49.99", status: "Paid" }
  ]
};

export function ClientSubscriptionDetails() {
  const apiUsagePercentage = Math.round((subscriptionData.apiUsed / subscriptionData.apiQuota) * 100);
  const storageUsagePercentage = Math.round((subscriptionData.storageUsed / subscriptionData.storageQuota) * 100);
  const chatbotsUsagePercentage = Math.round((subscriptionData.chatbotsUsed / subscriptionData.chatbotsQuota) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Current subscription details</CardDescription>
              </div>
              <Badge className="bg-primary">{subscriptionData.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-medium">Plan</span>
                </div>
                <span className="text-lg font-bold">{subscriptionData.plan}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Next Billing</span>
                </div>
                <span>{subscriptionData.nextBilling}</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Included Features:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {subscriptionData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                  {subscriptionData.apiUsed.toLocaleString()} / {subscriptionData.apiQuota.toLocaleString()}
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
                  {subscriptionData.storageUsed} GB / {subscriptionData.storageQuota} GB
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
                  {subscriptionData.chatbotsUsed} / {subscriptionData.chatbotsQuota}
                </span>
              </div>
              <Progress value={chatbotsUsagePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionData.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
