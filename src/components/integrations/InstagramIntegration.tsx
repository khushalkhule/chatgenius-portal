
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Instagram, ExternalLink, Check, AlertCircle } from "lucide-react";

interface InstagramAccount {
  id: string;
  username: string;
  profilePicture: string;
  connected: boolean;
  enabled: boolean;
  lastSynced: string | null;
  aiModel: string;
}

export const InstagramIntegration = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [apiKeys, setApiKeys] = useState<{openai: string | null, claude: string | null, mistral: string | null}>({
    openai: null,
    claude: null,
    mistral: null
  });

  // Load saved connection state from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem("instagramAccounts");
    const savedApiKeys = localStorage.getItem("adminApiKeys");
    
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts);
      setAccounts(accounts);
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setIsAutomationEnabled(accounts[0].enabled);
        setSelectedModel(accounts[0].aiModel || "gpt-4o-mini");
      }
    }
    
    if (savedApiKeys) {
      const keys = JSON.parse(savedApiKeys);
      const openaiKey = keys.find((k: any) => k.provider === "openai")?.key || null;
      const claudeKey = keys.find((k: any) => k.provider === "claude")?.key || null;
      const mistralKey = keys.find((k: any) => k.provider === "mistral")?.key || null;
      
      setApiKeys({
        openai: openaiKey,
        claude: claudeKey,
        mistral: mistralKey
      });
    }
  }, []);

  const saveAccountData = (updatedAccounts: InstagramAccount[]) => {
    setAccounts(updatedAccounts);
    localStorage.setItem("instagramAccounts", JSON.stringify(updatedAccounts));
  };

  const connectInstagram = () => {
    // In a real app, we would redirect to Instagram OAuth
    // For demo purposes, we'll simulate a successful connection
    
    const newAccount: InstagramAccount = {
      id: "123456789",
      username: "yourbusiness",
      profilePicture: "https://i.pravatar.cc/150?img=12",
      connected: true,
      enabled: false,
      lastSynced: new Date().toISOString(),
      aiModel: selectedModel
    };
    
    const updatedAccounts = [...accounts, newAccount];
    saveAccountData(updatedAccounts);
    setIsConnected(true);
    
    toast.success("Instagram account connected successfully!");
  };

  const disconnectInstagram = (accountId: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    saveAccountData(updatedAccounts);
    
    if (updatedAccounts.length === 0) {
      setIsConnected(false);
      setIsAutomationEnabled(false);
    }
    
    toast.success("Instagram account disconnected");
  };

  const toggleAutomation = (accountId: string, enabled: boolean) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId 
        ? { ...account, enabled, lastSynced: new Date().toISOString() } 
        : account
    );
    
    saveAccountData(updatedAccounts);
    setIsAutomationEnabled(enabled);
    
    if (enabled) {
      toast.success("Instagram DM automation enabled");
    } else {
      toast.success("Instagram DM automation disabled");
    }
  };

  const updateAiModel = (accountId: string, model: string) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId 
        ? { ...account, aiModel: model, lastSynced: new Date().toISOString() } 
        : account
    );
    
    saveAccountData(updatedAccounts);
    setSelectedModel(model);
    
    toast.success(`AI model updated to ${model}`);
  };

  const checkApiKeyAvailability = () => {
    const selectedProvider = selectedModel.includes("gpt") ? "openai" : 
                            selectedModel.includes("claude") ? "claude" : 
                            "mistral";
    
    return apiKeys[selectedProvider as keyof typeof apiKeys] !== null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Instagram Integration
        </CardTitle>
        <CardDescription>
          Connect your Instagram business account to automate DM responses using AI.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <Instagram className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Connect Instagram</h3>
              <p className="text-muted-foreground max-w-md">
                Link your Instagram business account to enable AI-powered automatic 
                responses to your direct messages.
              </p>
            </div>
            <Button onClick={connectInstagram} className="mt-4 gap-2">
              <Instagram className="h-4 w-4" />
              Connect Instagram Account
            </Button>
          </div>
        ) : (
          <>
            {accounts.map(account => (
              <div key={account.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={account.profilePicture} 
                        alt={account.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.username}</h3>
                      <p className="text-xs text-muted-foreground">
                        Connected on {new Date(account.lastSynced || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectInstagram(account.id)}
                  >
                    Disconnect
                  </Button>
                </div>
                
                <div className="space-y-6 border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dm-automation" className="text-base">DM Automation</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable AI responses to Instagram direct messages
                      </p>
                    </div>
                    <Switch 
                      id="dm-automation" 
                      checked={isAutomationEnabled}
                      onCheckedChange={(checked) => toggleAutomation(account.id, checked)}
                      disabled={!checkApiKeyAvailability()}
                    />
                  </div>
                  
                  {!checkApiKeyAvailability() && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <p className="text-sm">
                        No API key available for the selected AI model. Please contact your administrator.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model for Responses</Label>
                    <Select 
                      value={selectedModel}
                      onValueChange={(value) => updateAiModel(account.id, value)}
                    >
                      <SelectTrigger id="ai-model">
                        <SelectValue placeholder="Select AI Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">OpenAI GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o" disabled={!apiKeys.openai}>OpenAI GPT-4o</SelectItem>
                        <SelectItem value="claude-3-haiku" disabled={!apiKeys.claude}>Claude 3 Haiku</SelectItem>
                        <SelectItem value="claude-3-sonnet" disabled={!apiKeys.claude}>Claude 3 Sonnet</SelectItem>
                        <SelectItem value="mistral-medium" disabled={!apiKeys.mistral}>Mistral Medium</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select the AI model that will be used to respond to Instagram messages.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between items-center bg-muted/10">
        <div className="text-sm text-muted-foreground">
          {isConnected && isAutomationEnabled 
            ? <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Active</span> 
            : "Inactive"}
        </div>
        <Button variant="outline" size="sm" asChild className="gap-1">
          <a href="https://developers.facebook.com/docs/instagram-api/" target="_blank" rel="noopener noreferrer">
            Learn More <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
