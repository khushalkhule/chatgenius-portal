
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowRight, Check, Unlink, RefreshCw } from "lucide-react";

export function HubspotIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || apiKey.length < 10) {
      toast.error("Please enter a valid HubSpot API key");
      return;
    }

    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success("HubSpot connected successfully");
      
      // Save API key to localStorage
      localStorage.setItem("hubspot_api_key", apiKey);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    localStorage.removeItem("hubspot_api_key");
    toast.success("HubSpot disconnected");
  };

  // Check if we have a saved API key on component mount
  useState(() => {
    const savedApiKey = localStorage.getItem("hubspot_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConnected(true);
    }
  });

  const handleTestConnection = () => {
    setIsLoading(true);
    
    // Simulate API test
    setTimeout(() => {
      toast.success("HubSpot connection verified");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Logo.svg" alt="HubSpot" className="h-6" />
          HubSpot Integration
        </CardTitle>
        <CardDescription>
          Send leads from your chatbot directly to HubSpot CRM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">HubSpot API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="pat-na1-********-****-****-****-************"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter your HubSpot private app access token or API key.
              </p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect to HubSpot"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Connected to HubSpot</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <Unlink className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            <div>
              <Label className="text-sm">API Key</Label>
              <div className="mt-1 flex rounded-md overflow-hidden border">
                <div className="bg-muted px-3 py-2 text-sm text-muted-foreground w-full">
                  ••••••••••••••••{apiKey.substring(apiKey.length - 4)}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" onClick={handleTestConnection} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Switch 
              id="hubspot-activated" 
              checked={isConnected}
              onCheckedChange={(checked) => {
                if (!checked) handleDisconnect();
                if (checked && !isConnected && apiKey) handleConnect;
              }}
            />
            <Label htmlFor="hubspot-activated">
              {isConnected ? "Active" : "Inactive"}
            </Label>
          </div>
          <a 
            href="https://developers.hubspot.com/docs/api/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center hover:underline"
          >
            HubSpot API Docs <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
