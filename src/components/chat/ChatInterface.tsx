
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import api from "@/services/api";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
  className?: string;
  botName?: string;
  userName?: string;
  placeholder?: string;
  suggestedMessages?: string[];
  showLeadForm?: boolean;
  onLeadSubmit?: (leadData: any) => void;
  onSendMessage?: (message: string) => void;
  aiModelConfig?: {
    model: string;
    temperature: number;
    apiKey: string;
    systemPrompt?: string;
  };
  preserveFormatting?: boolean;
  chatbotId?: string;
}

const ChatInterface = ({
  initialMessages = [],
  className,
  botName = "AI Assistant",
  userName = "You",
  placeholder = "Type your message...",
  suggestedMessages = [],
  showLeadForm = false,
  onLeadSubmit,
  onSendMessage,
  aiModelConfig,
  preserveFormatting = false,
  chatbotId,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCollected, setLeadCollected] = useState(!showLeadForm);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: generateId(),
        content: "Hi there! How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    onSendMessage?.(inputValue);
    setInputValue("");

    setIsTyping(true);

    if (aiModelConfig?.apiKey) {
      try {
        console.log("Calling OpenAI API with config:", {
          model: aiModelConfig.model,
          temperature: aiModelConfig.temperature,
          systemPrompt: aiModelConfig.systemPrompt?.substring(0, 20) + "...",
          apiKeyPresent: !!aiModelConfig.apiKey
        });
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${aiModelConfig.apiKey}`
          },
          body: JSON.stringify({
            model: aiModelConfig.model || "gpt-4o-mini",
            messages: [
              { 
                role: "system", 
                content: aiModelConfig.systemPrompt || `You are an AI assistant named ${botName}. Be helpful, concise, and friendly.` 
              },
              ...messages.map(msg => ({
                role: msg.isBot ? "assistant" : "user",
                content: msg.content
              })),
              { role: "user", content: inputValue }
            ],
            temperature: aiModelConfig.temperature || 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
          const botMessage: Message = {
            id: generateId(),
            content: data.choices[0].message.content,
            isBot: true,
            timestamp: new Date(),
          };

          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          throw new Error("Invalid response from OpenAI API");
        }
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        
        const botMessage: Message = {
          id: generateId(),
          content: "I'm sorry, I encountered an error processing your request. Please try again later.",
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        toast.error("Failed to get response from AI service");
      } finally {
        setIsTyping(false);
      }
    } else {
      console.warn("No API key provided for AI model, using simulated response");
      
      setTimeout(() => {
        const botMessage: Message = {
          id: generateId(),
          content: "This is a simulated response. No API key was provided for the AI model.",
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleSuggestedMessageClick = (message: string) => {
    setInputValue(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadData.name || !leadData.email) {
      return;
    }
    
    if (chatbotId) {
      try {
        const response = await api.chatbots.addLead({
          ...leadData,
          chatbotId,
          source: window.location.href
        });
        
        if (response.success) {
          onLeadSubmit?.(leadData);
          setLeadCollected(true);
          
          const botMessage: Message = {
            id: generateId(),
            content: `Hi ${leadData.name}! Thanks for providing your information. How can I help you today?`,
            isBot: true,
            timestamp: new Date(),
          };
          
          setMessages([botMessage]);
        } else {
          toast.error(response.message || "Failed to submit lead information");
        }
      } catch (error) {
        console.error("Error submitting lead:", error);
        toast.error("Failed to submit your information. Please try again.");
      }
    } else {
      onLeadSubmit?.(leadData);
      setLeadCollected(true);
      
      const botMessage: Message = {
        id: generateId(),
        content: `Hi ${leadData.name}! Thanks for providing your information. How can I help you today?`,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages([botMessage]);
    }
  };

  if (showLeadForm && !leadCollected) {
    return (
      <Card
        className={cn(
          "w-full max-w-md h-[500px] flex flex-col border shadow-lg",
          className
        )}
      >
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {botName.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-sm">{botName}</h3>
              <p className="text-xs text-muted-foreground">Please provide your details to continue</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                How can we help you? (Optional)
              </label>
              <Input
                id="message"
                value={leadData.message}
                onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                placeholder="Your question or request"
              />
            </div>
            <Button type="submit" className="w-full">
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "w-full max-w-md h-[500px] flex flex-col border shadow-lg",
        className
      )}
    >
      <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {botName.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-sm">{botName}</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isBot={message.isBot}
            botName={botName}
            userName={userName}
            timestamp={message.timestamp}
            preserveFormatting={preserveFormatting}
          />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {botName.charAt(0)}
            </div>
            <div className="px-4 py-2 rounded-2xl rounded-tl-sm bg-secondary/50 text-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        {suggestedMessages && suggestedMessages.length > 0 && messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestedMessages.map((msg, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedMessageClick(msg)}
                className="text-xs py-1 px-3 h-auto rounded-full"
              >
                {msg}
              </Button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-2 border-t">
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 py-6"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
