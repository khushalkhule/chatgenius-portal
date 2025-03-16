
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Database, Download, FileText, MessageSquare, Package, User, DollarSign, CreditCard, Plus, Settings, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const subscriptionData = {
  plan: "Enterprise",
  status: "Active",
  nextBilling: "July 15, 2025",
  apiQuota: 1000000,
  apiUsed: 543210,
  storageQuota: 100, // in GB
  storageUsed: 43.5, // in GB
  chatbotsQuota: 250,
  chatbotsUsed: 124,
  features: [
    "Unlimited team members",
    "Custom AI model integration",
    "Advanced analytics",
    "White-label chatbots",
    "Priority support",
    "Custom domain",
  ],
  subscribers: [
    { 
      id: "1", 
      name: "John Doe", 
      email: "client@chatsaas.com", 
      plan: "Pro", 
      started: "2023-05-10", 
      nextBilling: "2024-05-10", 
      amount: "$49.99/mo", 
      status: "Active" 
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      email: "jane.smith@example.com", 
      plan: "Business", 
      started: "2023-06-15", 
      nextBilling: "2024-06-15", 
      amount: "$99.99/mo", 
      status: "Active" 
    },
    { 
      id: "3", 
      name: "Mike Johnson", 
      email: "mike.johnson@example.com", 
      plan: "Basic", 
      started: "2023-07-22", 
      nextBilling: "2024-07-22", 
      amount: "$24.99/mo", 
      status: "Inactive" 
    }
  ],
  plans: [
    {
      id: "free",
      name: "Free Trial",
      price: "Free",
      priceValue: 0,
      period: "",
      chatbots: 1,
      apiCalls: 50,
      storage: 1,
      description: "Try our platform for 7 days with limited features.",
      features: ["1 chatbot", "50 messages", "7-day trial", "Basic templates", "Email support"],
      highlighted: false,
      badge: "7 days"
    },
    {
      id: "basic",
      name: "Starter",
      price: "$39/mo",
      priceValue: 39,
      period: "/month, billed annually",
      priceMonthly: "$49/mo",
      priceMonthlyValue: 49,
      chatbots: 1,
      apiCalls: 5000,
      storage: 5,
      description: "For small businesses and individuals getting started with AI chatbots.",
      features: [
        "1 Chatbot",
        "5,000 messages per month",
        "1,000 AI tokens per day",
        "Standard widgets and templates",
        "Email support",
        "Basic analytics"
      ],
      highlighted: false
    },
    {
      id: "pro",
      name: "Professional",
      price: "$99/mo",
      priceValue: 99,
      period: "/month, billed annually",
      priceMonthly: "$119/mo",
      priceMonthlyValue: 119,
      chatbots: 5,
      apiCalls: 25000,
      storage: 25,
      description: "For growing businesses that need more advanced features and capacity.",
      features: [
        "5 Chatbots",
        "25,000 messages per month",
        "10,000 AI tokens per day",
        "Advanced customization",
        "Lead capture forms",
        "Integrations with CRM/Email",
        "Priority email & chat support",
        "Detailed analytics & reporting"
      ],
      highlighted: true,
      badge: "Popular"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$299/mo",
      priceValue: 299,
      period: "/month, billed annually",
      priceMonthly: "$349/mo",
      priceMonthlyValue: 349,
      chatbots: "Unlimited",
      apiCalls: 100000,
      storage: 100,
      description: "For larger organizations with advanced needs and security requirements.",
      features: [
        "Unlimited Chatbots",
        "100,000 messages per month",
        "Unlimited AI tokens",
        "Custom integrations",
        "Advanced security & compliance",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom analytics & reporting",
        "Team collaboration features"
      ],
      highlighted: false
    }
  ]
};

export function SubscriptionDetails() {
  const apiUsagePercentage = Math.round((subscriptionData.apiUsed / subscriptionData.apiQuota) * 100);
  const storageUsagePercentage = Math.round((subscriptionData.storageUsed / subscriptionData.storageQuota) * 100);
  const chatbotsUsagePercentage = Math.round((subscriptionData.chatbotsUsed / subscriptionData.chatbotsQuota) * 100);
  
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editablePlan, setEditablePlan] = useState(null);
  const [subscriberDetailsOpen, setSubscriberDetailsOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isDeletePlanDialogOpen, setIsDeletePlanDialogOpen] = useState(false);
  const [plans, setPlans] = useState(subscriptionData.plans);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    priceValue: 0,
    period: "/month, billed annually",
    priceMonthly: "",
    priceMonthlyValue: 0,
    chatbots: 0,
    apiCalls: 0,
    storage: 0,
    description: "",
    features: [""],
    highlighted: false,
    badge: ""
  });
  const [isRazorpayConfigOpen, setIsRazorpayConfigOpen] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState({
    keyId: "",
    keySecret: "",
    webhookSecret: "",
    isLive: false
  });

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditablePlan({
      ...plan,
      features: [...plan.features]
    });
    setIsEditPlanOpen(true);
  };

  const handleEditPlanChange = (field, value) => {
    setEditablePlan(prev => {
      if (!prev) return null;
      
      // Convert numeric fields to numbers
      if (['priceValue', 'priceMonthlyValue', 'chatbots', 'apiCalls', 'storage'].includes(field)) {
        return {
          ...prev,
          [field]: value === "" ? 0 : Number(value)
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleEditFeature = (index, value) => {
    if (!editablePlan) return;
    
    const updatedFeatures = [...editablePlan.features];
    updatedFeatures[index] = value;
    
    setEditablePlan({
      ...editablePlan,
      features: updatedFeatures
    });
  };

  const handleAddFeature = () => {
    if (!editablePlan) return;
    
    setEditablePlan({
      ...editablePlan,
      features: [...editablePlan.features, ""]
    });
  };

  const handleRemoveFeature = (index) => {
    if (!editablePlan) return;
    
    const updatedFeatures = [...editablePlan.features];
    updatedFeatures.splice(index, 1);
    
    setEditablePlan({
      ...editablePlan,
      features: updatedFeatures
    });
  };

  const handleSaveEditPlan = () => {
    if (!editablePlan || !selectedPlan) return;
    
    const updatedPlans = plans.map(plan => 
      plan.id === selectedPlan.id ? { 
        ...editablePlan,
        id: selectedPlan.id
      } : plan
    );
    
    setPlans(updatedPlans);
    toast.success(`Plan "${editablePlan.name}" updated successfully`);
    setIsEditPlanOpen(false);
  };

  const openDeletePlanDialog = (plan) => {
    setSelectedPlan(plan);
    setIsDeletePlanDialogOpen(true);
  };

  const handleDeletePlan = () => {
    if (!selectedPlan) return;
    
    const updatedPlans = plans.filter(plan => plan.id !== selectedPlan.id);
    setPlans(updatedPlans);
    
    toast.success(`Plan "${selectedPlan.name}" deleted successfully`);
    setIsDeletePlanDialogOpen(false);
  };

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    // Create new plan with numeric values properly converted
    const newPlanWithId = {
      ...newPlan,
      id: crypto.randomUUID(),
      priceValue: Number(newPlan.priceValue),
      priceMonthlyValue: Number(newPlan.priceMonthlyValue),
      chatbots: Number(newPlan.chatbots),
      apiCalls: Number(newPlan.apiCalls),
      storage: Number(newPlan.storage)
    };
    
    setPlans([...plans, newPlanWithId]);
    setNewPlan({
      name: "",
      price: "",
      priceValue: 0,
      period: "/month, billed annually",
      priceMonthly: "",
      priceMonthlyValue: 0,
      chatbots: 0,
      apiCalls: 0,
      storage: 0,
      description: "",
      features: [""],
      highlighted: false,
      badge: ""
    });
    
    toast.success(`New plan "${newPlan.name}" created successfully`);
    setIsNewPlanOpen(false);
  };

  const handleNewPlanChange = (field, value) => {
    setNewPlan(prev => {
      // Convert numeric fields to numbers when storing in state
      if (['priceValue', 'priceMonthlyValue', 'chatbots', 'apiCalls', 'storage'].includes(field)) {
        return {
          ...prev,
          [field]: value === "" ? 0 : Number(value)
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleNewPlanFeatureChange = (index, value) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = value;
    
    setNewPlan({
      ...newPlan,
      features: updatedFeatures
    });
  };

  const handleAddNewPlanFeature = () => {
    setNewPlan({
      ...newPlan,
      features: [...newPlan.features, ""]
    });
  };

  const handleRemoveNewPlanFeature = (index) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures.splice(index, 1);
    
    setNewPlan({
      ...newPlan,
      features: updatedFeatures
    });
  };

  const handleViewSubscriberDetails = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setSubscriberDetailsOpen(true);
  };

  const handleSaveRazorpayConfig = () => {
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
      toast.error("Please provide Razorpay API Key ID and Secret Key");
      return;
    }
    
    toast.success("Razorpay configuration saved successfully");
    setIsRazorpayConfigOpen(false);
  };

  return (
    <Tabs defaultValue="plans" className="space-y-6">
      <TabsList>
        <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        <TabsTrigger value="usage">Platform Usage</TabsTrigger>
        <TabsTrigger value="payments">Payment Gateways</TabsTrigger>
      </TabsList>
      
      <TabsContent value="plans" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.highlighted ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-1">{plan.period}</span>
                </CardDescription>
                {plan.badge && (
                  <Badge className="absolute top-2 right-2">{plan.badge}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm">Chatbots</span>
                    </div>
                    <span className="font-medium">{plan.chatbots}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">Messages</span>
                    </div>
                    <span className="font-medium">{plan.apiCalls}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm">Storage</span>
                    </div>
                    <span className="font-medium">{plan.storage} GB</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <ul className="space-y-1 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => handleEditPlan(plan)}
                    >
                      Edit Plan
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      className="px-3"
                      onClick={() => openDeletePlanDialog(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Plan</CardTitle>
            <CardDescription>Create a new subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setIsNewPlanOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="subscribers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>Users who have subscribed to paid plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionData.subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscriber.name}</div>
                        <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{subscriber.plan}</TableCell>
                    <TableCell>{new Date(subscriber.started).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(subscriber.nextBilling).toLocaleDateString()}</TableCell>
                    <TableCell>{subscriber.amount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={subscriber.status === "Active" ? "default" : "secondary"}
                        className={subscriber.status === "Active" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {subscriber.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewSubscriberDetails(subscriber)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="usage" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Usage</CardTitle>
                  <CardDescription>Current usage of platform resources</CardDescription>
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
      </TabsContent>
      
      <TabsContent value="payments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Configuration</CardTitle>
            <CardDescription>Configure payment gateways for subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-10 w-10" />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-muted-foreground">
                      Payment gateway for Indian businesses
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsRazorpayConfigOpen(true)}>
                  Configure
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      Global payment gateway (Coming soon)
                    </p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Free Trial Configuration</CardTitle>
            <CardDescription>Configure free trial settings for new users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trial-enabled">Enable Free Trial</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to try the platform before subscribing
                  </p>
                </div>
                <Switch id="trial-enabled" defaultChecked />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trial-days">Trial Period (days)</Label>
                  <Input id="trial-days" defaultValue="7" type="number" />
                </div>
                <div>
                  <Label htmlFor="trial-messages">Message Limit</Label>
                  <Input id="trial-messages" defaultValue="50" type="number" />
                </div>
                <div>
                  <Label htmlFor="trial-chatbots">Chatbot Limit</Label>
                  <Input id="trial-chatbots" defaultValue="1" type="number" />
                </div>
              </div>
              
              <Button>Save Trial Settings</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan: {editablePlan?.name}</DialogTitle>
            <DialogDescription>
              Update the details for this subscription plan
            </DialogDescription>
          </DialogHeader>
          {editablePlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="plan-name"
                  value={editablePlan.name}
                  onChange={(e) => handleEditPlanChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-price" className="text-right">
                  Annual Price
                </Label>
                <Input
                  id="plan-price"
                  value={editablePlan.price}
                  onChange={(e) => handleEditPlanChange('price', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-price-value" className="text-right">
                  Annual Price Value
                </Label>
                <Input
                  id="plan-price-value"
                  type="number"
                  value={editablePlan.priceValue}
                  onChange={(e) => handleEditPlanChange('priceValue', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-price-monthly" className="text-right">
                  Monthly Price
                </Label>
                <Input
                  id="plan-price-monthly"
                  value={editablePlan.priceMonthly || ""}
                  onChange={(e) => handleEditPlanChange('priceMonthly', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-price-monthly-value" className="text-right">
                  Monthly Price Value
                </Label>
                <Input
                  id="plan-price-monthly-value"
                  type="number"
                  value={editablePlan.priceMonthlyValue || 0}
                  onChange={(e) => handleEditPlanChange('priceMonthlyValue', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="plan-description"
                  value={editablePlan.description || ""}
                  onChange={(e) => handleEditPlanChange('description', e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-chatbots" className="text-right">
                  Chatbots
                </Label>
                <Input
                  id="plan-chatbots"
                  type="number"
                  value={editablePlan.chatbots || 0}
                  onChange={(e) => handleEditPlanChange('chatbots', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-api" className="text-right">
                  Messages
                </Label>
                <Input
                  id="plan-api"
                  type="number"
                  value={editablePlan.apiCalls || 0}
                  onChange={(e) => handleEditPlanChange('apiCalls', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-storage" className="text-right">
                  Storage (GB)
                </Label>
                <Input
                  id="plan-storage"
                  type="number"
                  value={editablePlan.storage || 0}
                  onChange={(e) => handleEditPlanChange('storage', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-badge" className="text-right">
                  Badge (optional)
                </Label>
                <Input
                  id="plan-badge"
                  value={editablePlan.badge || ""}
                  onChange={(e) => handleEditPlanChange('badge', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-highlighted" className="text-right">
                  Highlighted
                </Label>
                <Switch
                  id="plan-highlighted"
                  checked={editablePlan.highlighted || false}
                  onCheckedChange={(checked) => handleEditPlanChange('highlighted', checked)}
                  className="col-span-3"
                />
              </div>
              
              <div className="border-t pt-4 mt-2">
                <Label className="mb-2 block">Features:</Label>
                {editablePlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleEditFeature(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={editablePlan.features.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddFeature}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditPlan}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Set up a new subscription plan for your customers
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-plan-name"
                value={newPlan.name}
                onChange={(e) => handleNewPlanChange('name', e.target.value)}
                className="col-span-3"
                placeholder="Premium"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-price" className="text-right">
                Annual Price
              </Label>
              <Input
                id="new-plan-price"
                value={newPlan.price}
                onChange={(e) => handleNewPlanChange('price', e.target.value)}
                className="col-span-3"
                placeholder="$79/mo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-price-value" className="text-right">
                Annual Price Value
              </Label>
              <Input
                id="new-plan-price-value"
                type="number"
                value={newPlan.priceValue}
                onChange={(e) => handleNewPlanChange('priceValue', e.target.value)}
                className="col-span-3"
                placeholder="79"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-price-monthly" className="text-right">
                Monthly Price
              </Label>
              <Input
                id="new-plan-price-monthly"
                value={newPlan.priceMonthly}
                onChange={(e) => handleNewPlanChange('priceMonthly', e.target.value)}
                className="col-span-3"
                placeholder="$99/mo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-price-monthly-value" className="text-right">
                Monthly Price Value
              </Label>
              <Input
                id="new-plan-price-monthly-value"
                type="number"
                value={newPlan.priceMonthlyValue}
                onChange={(e) => handleNewPlanChange('priceMonthlyValue', e.target.value)}
                className="col-span-3"
                placeholder="99"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="new-plan-description"
                value={newPlan.description}
                onChange={(e) => handleNewPlanChange('description', e.target.value)}
                className="col-span-3"
                placeholder="For growing businesses"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-chatbots" className="text-right">
                Chatbots
              </Label>
              <Input
                id="new-plan-chatbots"
                type="number"
                value={newPlan.chatbots}
                onChange={(e) => handleNewPlanChange('chatbots', e.target.value)}
                className="col-span-3"
                placeholder="75"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-api" className="text-right">
                Messages
              </Label>
              <Input
                id="new-plan-api"
                type="number"
                value={newPlan.apiCalls}
                onChange={(e) => handleNewPlanChange('apiCalls', e.target.value)}
                className="col-span-3"
                placeholder="25000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-storage" className="text-right">
                Storage (GB)
              </Label>
              <Input
                id="new-plan-storage"
                type="number"
                value={newPlan.storage}
                onChange={(e) => handleNewPlanChange('storage', e.target.value)}
                className="col-span-3"
                placeholder="75"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-badge" className="text-right">
                Badge (optional)
              </Label>
              <Input
                id="new-plan-badge"
                value={newPlan.badge}
                onChange={(e) => handleNewPlanChange('badge', e.target.value)}
                className="col-span-3"
                placeholder="New"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-plan-highlighted" className="text-right">
                Highlighted
              </Label>
              <Switch
                id="new-plan-highlighted"
                checked={newPlan.highlighted}
                onCheckedChange={(checked) => setNewPlan({...newPlan, highlighted: checked})}
                className="col-span-3"
              />
            </div>
            
            <div className="border-t pt-4 mt-2">
              <Label className="mb-2 block">Features:</Label>
              {newPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleNewPlanFeatureChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveNewPlanFeature(index)}
                    disabled={newPlan.features.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddNewPlanFeature}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={subscriberDetailsOpen} onOpenChange={setSubscriberDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subscriber Details</DialogTitle>
            <DialogDescription>
              Detailed information about the subscriber
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscriber && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{selectedSubscriber.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedSubscriber.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                  <p className="text-base">{selectedSubscriber.plan}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge 
                    variant={selectedSubscriber.status === "Active" ? "default" : "secondary"}
                    className={selectedSubscriber.status === "Active" ? "bg-green-500" : "bg-gray-500"}
                  >
                    {selectedSubscriber.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Started</h3>
                  <p className="text-base">{new Date(selectedSubscriber.started).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Next Billing</h3>
                  <p className="text-base">{new Date(selectedSubscriber.nextBilling).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                  <p className="text-base">{selectedSubscriber.amount}</p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline">Email User</Button>
                <div className="space-x-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant={selectedSubscriber.status === "Active" ? "destructive" : "success"}>
                    {selectedSubscriber.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRazorpayConfigOpen} onOpenChange={setIsRazorpayConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Razorpay Configuration</DialogTitle>
            <DialogDescription>
              Configure Razorpay API keys for payment integration
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razorpay-key-id" className="text-right">
                API Key ID
              </Label>
              <Input
                id="razorpay-key-id"
                value={razorpayConfig.keyId}
                onChange={(e) => setRazorpayConfig({...razorpayConfig, keyId: e.target.value})}
                className="col-span-3"
                placeholder="rzp_test_XXXXXXXXXX"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razorpay-key-secret" className="text-right">
                Secret Key
              </Label>
              <Input
                id="razorpay-key-secret"
                type="password"
                value={razorpayConfig.keySecret}
                onChange={(e) => setRazorpayConfig({...razorpayConfig, keySecret: e.target.value})}
                className="col-span-3"
                placeholder="••••••••••••••••••••"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razorpay-webhook-secret" className="text-right">
                Webhook Secret
              </Label>
              <Input
                id="razorpay-webhook-secret"
                type="password"
                value={razorpayConfig.webhookSecret}
                onChange={(e) => setRazorpayConfig({...razorpayConfig, webhookSecret: e.target.value})}
                className="col-span-3"
                placeholder="••••••••••••••••••••"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razorpay-mode" className="text-right">
                Live Mode
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="razorpay-mode"
                  checked={razorpayConfig.isLive}
                  onCheckedChange={(checked) => setRazorpayConfig({...razorpayConfig, isLive: checked})}
                />
                <span className="text-sm text-muted-foreground">
                  {razorpayConfig.isLive ? "Using live keys" : "Using test keys"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRazorpayConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRazorpayConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeletePlanDialogOpen} onOpenChange={setIsDeletePlanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{selectedPlan?.name}" plan? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
