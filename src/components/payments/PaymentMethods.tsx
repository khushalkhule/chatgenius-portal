
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock saved payment methods
const savedMethods = [
  { id: "pm_1", type: "card", last4: "4242", expMonth: 12, expYear: 2026 }
];

const PaymentMethods = () => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    exp: "",
    cvv: "",
    name: ""
  });

  const handleAddPaymentMethod = () => {
    if (!cardDetails.number || !cardDetails.exp || !cardDetails.cvv || !cardDetails.name) {
      toast.error("Please fill in all card details");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Payment method added successfully");
      setIsProcessing(false);
      setIsAddCardOpen(false);
      setCardDetails({ number: "", exp: "", cvv: "", name: "" });
    }, 1500);
  };

  const handleDeletePaymentMethod = (id: string) => {
    toast.success("Payment method removed");
  };

  const handleInitiateRazorpayPayment = () => {
    toast.info("Initiating Razorpay payment...");
    // In a real implementation, we would:
    // 1. Call backend to create an order
    // 2. Load Razorpay SDK
    // 3. Open Razorpay payment dialog
    
    // Simulating success for demo
    setTimeout(() => {
      toast.success("Payment successful");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your saved payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedMethods.map((method) => (
              <div key={method.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Card ending in {method.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePaymentMethod(method.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            
            <div className="pt-4">
              <Button variant="outline" onClick={() => setIsAddCardOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Razorpay Payments</CardTitle>
          <CardDescription>
            Securely make payments with Razorpay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
              <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-10 w-10" />
              <div>
                <p className="font-medium">Razorpay</p>
                <p className="text-sm text-muted-foreground">
                  Secure payments for Indian businesses
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select defaultValue="pro">
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter ($39/month)</SelectItem>
                      <SelectItem value="pro">Professional ($99/month)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($299/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billing">Billing Cycle</Label>
                  <Select defaultValue="annual">
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual (20% off)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleInitiateRazorpayPayment}>
                Pay with Razorpay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input 
                id="card-name" 
                placeholder="Name on card"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input 
                id="card-number" 
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input 
                  id="card-expiry" 
                  placeholder="MM/YY"
                  value={cardDetails.exp}
                  onChange={(e) => setCardDetails({...cardDetails, exp: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="card-cvv">CVV</Label>
                <Input 
                  id="card-cvv" 
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Add Payment Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
