
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, Check, X, DollarSign, Server, Database, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubscriptionPlan } from "@/contexts/SubscriptionContext";

const planFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  price_value: z.number().min(0, "Price value must be a positive number"),
  period: z.string().min(1, "Period is required"),
  price_monthly: z.string().optional(),
  price_monthly_value: z.number().optional(),
  chatbots: z.number().min(0, "Chatbot limit must be a positive number"),
  api_calls: z.number().min(0, "API call limit must be a positive number"),
  storage: z.number().min(0, "Storage limit must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()),
  highlighted: z.boolean().default(false),
  badge: z.string().optional()
});

type PlanFormValues = z.infer<typeof planFormSchema>;

export const PlanManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      price: "",
      price_value: 0,
      period: "yearly",
      price_monthly: "",
      chatbots: 1,
      api_calls: 1000,
      storage: 1,
      description: "",
      features: [],
      highlighted: false,
      badge: ""
    }
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const result = await api.subscriptions.getAllPlans();
      
      const formattedPlans = result.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        price_value: Number(plan.price_value),
        period: plan.period,
        price_monthly: plan.price_monthly,
        price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
        chatbots: Number(plan.chatbots),
        api_calls: Number(plan.api_calls || 0),
        storage: Number(plan.storage),
        description: plan.description,
        features: Array.isArray(plan.features) ? plan.features : [],
        highlighted: Boolean(plan.highlighted),
        badge: plan.badge || '',
        created_at: plan.created_at,
        updated_at: plan.updated_at
      }));
      
      setPlans(formattedPlans);
    } catch (error) {
      console.error("Failed to load subscription plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const planData = {
        ...data,
        id: data.id || crypto.randomUUID()
      };
      
      if (isEditing && data.id) {
        await api.subscriptions.updatePlan(data.id, planData);
        toast.success("Plan updated successfully");
      } else {
        await api.subscriptions.createPlan(planData);
        toast.success("Plan created successfully");
      }
      
      setOpenDialog(false);
      form.reset();
      loadPlans();
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error("Failed to save plan");
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    form.reset(plan);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      try {
        await api.subscriptions.deletePlan(id);
        toast.success("Plan deleted successfully");
        loadPlans();
      } catch (error) {
        console.error("Failed to delete plan:", error);
        toast.error("Failed to delete plan");
      }
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
  };
  
  const handleAddPlan = () => {
    form.reset({
      name: "",
      price: "",
      price_value: 0,
      period: "yearly",
      price_monthly: "",
      chatbots: 1,
      api_calls: 1000,
      storage: 1,
      description: "",
      features: [],
      highlighted: false,
      badge: ""
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Manage the subscription plans available to your users.
            </CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleAddPlan} className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Plan" : "Add New Plan"}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? "Update the details of this subscription plan."
                    : "Create a new subscription plan for your users."}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="limits">Limits & Features</TabsTrigger>
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plan Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Basic Plan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Display</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $99/year" {...field} />
                              </FormControl>
                              <FormDescription>
                                How the price will be displayed to users
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="price_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Value (in USD)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 99" 
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Numerical value for sorting and calculations
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="period"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Period</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., yearly, monthly" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price_monthly"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Price Display (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $9.99/month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="price_monthly_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Price Value (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 9.99" 
                                  value={field.value || ""}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe what this plan offers..." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="limits" className="space-y-4 mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="chatbots"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chatbot Limit</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Number of chatbots allowed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="api_calls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly API Calls</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                API calls per month
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="storage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Storage (GB)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Storage space in gigabytes
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormLabel>Plan Features</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a feature..."
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeature();
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddFeature}>
                            Add
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {form.watch("features")?.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between rounded border p-2">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFeature(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {form.watch("features")?.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              No features added yet
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="highlighted"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Highlight Plan</FormLabel>
                              <FormDescription>
                                Mark this plan as recommended or popular
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="badge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge Text</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Most Popular, Best Value" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional badge to display on the plan
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditing ? "Update Plan" : "Create Plan"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {loading ? (
            <div className="text-center py-10">Loading plans...</div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-10">
              {searchQuery ? "No matching plans found" : "No plans created yet"}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className={plan.highlighted ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      {plan.badge && (
                        <Badge variant="secondary">{plan.badge}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-4">
                      <p className="text-2xl font-bold">{plan.price}</p>
                      {plan.price_monthly && (
                        <p className="text-sm text-muted-foreground">{plan.price_monthly}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.chatbots} Chatbots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.api_calls.toLocaleString()} API calls/mo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.storage} GB Storage</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{plan.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanManagement;
