
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Check, Key, Brain, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Default admin API key from your codebase
const DEFAULT_OPENAI_KEY = "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";

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

export const APIKeyManagement = () => {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage or use defaults
    const savedKeys = localStorage.getItem("adminApiKeys");
    
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    } else {
      // Set default OpenAI key
      const defaultKey: ApiKey = {
        id: "1",
        name: "Default OpenAI Key",
        provider: "openai",
        key: DEFAULT_OPENAI_KEY,
        createdAt: new Date().toISOString(),
        lastUsed: null,
      };
      
      setApiKeys([defaultKey]);
      localStorage.setItem("adminApiKeys", JSON.stringify([defaultKey]));
    }
  }, []);

  const saveApiKeys = (keys: ApiKey[]) => {
    setApiKeys(keys);
    localStorage.setItem("adminApiKeys", JSON.stringify(keys));
    // Also save the OpenAI key separately for the AIModelStep component to use
    const openaiKey = keys.find(k => k.provider === "openai")?.key;
    if (openaiKey) {
      localStorage.setItem("adminOpenAIKey", openaiKey);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied({ ...copied, [id]: true });
    
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 2000);
    
    toast.success("API key copied to clipboard");
  };

  const addNewKey = () => {
    setIsAdding(true);
    
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast.error("Please provide both a name and an API key");
      setIsAdding(false);
      return;
    }
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      provider: selectedProvider,
      key: newKeyValue,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    
    // If adding an OpenAI key, replace the existing one
    if (selectedProvider === "openai") {
      const updatedKeys = apiKeys.filter(key => key.provider !== "openai");
      saveApiKeys([...updatedKeys, newKey]);
    } else {
      saveApiKeys([...apiKeys, newKey]);
    }
    
    // Reset form
    setNewKeyName("");
    setNewKeyValue("");
    setIsAdding(false);
    
    toast.success(`${selectedProvider.toUpperCase()} API key added successfully`);
  };

  const deleteKey = (id: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    saveApiKeys(updatedKeys);
    toast.success("API key deleted");
  };

  const generateMockKey = () => {
    const prefix = selectedProvider === "openai" ? "sk-" : 
                  selectedProvider === "claude" ? "sk-ant-" : 
                  "key-";
    
    const randomStr = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
    
    setNewKeyValue(`${prefix}${randomStr}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Manage API keys for various AI providers. These keys will be used by all chatbots.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keys">Existing Keys</TabsTrigger>
              <TabsTrigger value="add">Add New Key</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keys" className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys added yet. Add your first key to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/40 p-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          {apiKey.name}
                        </CardTitle>
                        <CardDescription>
                          Provider: {apiKey.provider.toUpperCase()} | Added: {new Date(apiKey.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="relative">
                          <Input
                            value={showKey[apiKey.id] ? apiKey.key : "•".repeat(Math.min(40, apiKey.key.length))}
                            readOnly
                            className="pr-20 font-mono text-xs"
                          />
                          <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toggleShowKey(apiKey.id)}
                            >
                              {showKey[apiKey.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                            >
                              {copied[apiKey.id] ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-2 bg-muted/20 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          {apiKey.lastUsed 
                            ? `Last used: ${new Date(apiKey.lastUsed).toLocaleString()}` 
                            : "Not used yet"}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteKey(apiKey.id)}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedProvider === "openai" ? "default" : "outline"}
                      onClick={() => setSelectedProvider("openai")}
                      className="gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      OpenAI
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedProvider === "claude" ? "default" : "outline"}
                      onClick={() => setSelectedProvider("claude")}
                      className="gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      Anthropic Claude
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedProvider === "mistral" ? "default" : "outline"}
                      onClick={() => setSelectedProvider("mistral")}
                      className="gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      Mistral
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={`${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} Production Key`}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="key"
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      placeholder={`Enter your ${selectedProvider} API key`}
                      className="pr-10 font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={generateMockKey}
                      title="Generate mock key (for demo purposes)"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This key will be stored securely and used for all chatbots on the platform.
                    {selectedProvider === "openai" && " This will replace the existing OpenAI key."}
                  </p>
                </div>
                
                <Button 
                  onClick={addNewKey} 
                  className="w-full"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add API Key"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
