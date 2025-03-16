
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowRight, Check, Unlink, Link as LinkIcon } from "lucide-react";

export function ZapierIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl || !webhookUrl.includes("hooks.zapier.com")) {
      toast.error("Please enter a valid Zapier webhook URL");
      return;
    }

    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success("Zapier webhook connected successfully");
      
      // Save webhook URL to localStorage
      localStorage.setItem("zapier_webhook_url", webhookUrl);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWebhookUrl("");
    localStorage.removeItem("zapier_webhook_url");
    toast.success("Zapier webhook disconnected");
  };

  // Check if we have a saved webhook URL on component mount
  useState(() => {
    const savedWebhookUrl = localStorage.getItem("zapier_webhook_url");
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
      setIsConnected(true);
    }
  });

  const handleTestWebhook = async () => {
    setIsLoading(true);
    
    try {
      // Send a test lead to the webhook
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Required for cross-origin requests
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          phone: "123-456-7890",
          source: "Chatbot Lead Form Test",
          timestamp: new Date().toISOString()
        }),
      });
      
      toast.success("Test lead sent to Zapier");
    } catch (error) {
      console.error("Error sending test lead:", error);
      toast.error("Failed to send test lead");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg" alt="Zapier" className="h-6" />
          Zapier Integration
        </CardTitle>
        <CardDescription>
          Connect your chatbot lead forms to thousands of apps via Zapier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook">Zapier Webhook URL</Label>
              <Input
                id="webhook"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Create a Zap with a Webhook trigger, then paste the webhook URL here.
              </p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect to Zapier"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Connected to Zapier</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <Unlink className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            <div>
              <Label className="text-sm">Your webhook URL</Label>
              <div className="mt-1 flex rounded-md overflow-hidden border">
                <div className="bg-muted px-3 py-2 text-sm text-muted-foreground w-full overflow-hidden text-ellipsis">
                  {webhookUrl}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" onClick={handleTestWebhook} disabled={isLoading}>
                Send Test Lead
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Switch 
              id="zapier-activated" 
              checked={isConnected}
              onCheckedChange={(checked) => {
                if (!checked) handleDisconnect();
                if (checked && !isConnected && webhookUrl) handleConnect;
              }}
            />
            <Label htmlFor="zapier-activated">
              {isConnected ? "Active" : "Inactive"}
            </Label>
          </div>
          <a 
            href="https://zapier.com/apps/webhook/integrations" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center hover:underline"
          >
            Zapier Webhook Guide <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
