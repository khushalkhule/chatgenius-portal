import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useChatbots } from "@/contexts/ChatbotContext";
import { useParams } from 'react-router-dom';
import { initializeDatabase } from "@/services/api";
import api from "@/services/api";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatInterface = () => {
  const { toast } = useToast();
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const { getChatbot } = useChatbots();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatbotName, setChatbotName] = useState<string>('Chatbot');
  const [initialMessage, setInitialMessage] = useState<string>('');
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState<string>('Type your message...');
  
  useEffect(() => {
    const fetchChatbotDetails = async () => {
      if (chatbotId) {
        try {
          // Initialize the mock database
          await initializeDatabase();
          
          // Fetch chatbot details using the chatbot ID
          const chatbot = await api.chatbots.getChatbotById(chatbotId);
          
          if (chatbot) {
            // Set the chatbot name
            setChatbotName(chatbot.configuration?.design?.name || 'Chatbot');
            
            // Set the initial message
            setInitialMessage(chatbot.configuration?.design?.initialMessage || '');
            
            // Set the suggested messages
            const suggestedMessagesStr = chatbot.configuration?.design?.suggestedMessages || '';
            setSuggestedMessages(suggestedMessagesStr.split('\n'));
            
            // Set the placeholder
            setPlaceholder(chatbot.configuration?.design?.placeholder || 'Type your message...');
          } else {
            toast({
              title: "Error",
              description: "Failed to load chatbot details.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching chatbot details:", error);
          toast({
            title: "Error",
            description: "Failed to load chatbot details.",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchChatbotDetails();
  }, [chatbotId, getChatbot, toast]);
  
  useEffect(() => {
    if (initialMessage) {
      setMessages([{
        id: 'initial-message',
        text: initialMessage,
        sender: 'bot'
      }]);
    }
  }, [initialMessage]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsSubmitting(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: `This is a simulated response to: ${input}`,
        sender: 'bot',
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSuggestedMessageClick = (message: string) => {
    setInput(message);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">{chatbotName}</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={chatContainerRef} className="h-full">
          <Card className="w-full rounded-none shadow-none">
            <CardContent className="p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex flex-col items-start gap-2">
                      {message.sender === 'bot' && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Bot Avatar" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-md px-3 py-2 text-sm ${message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                          }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isSubmitting && (
                  <div className="flex justify-start">
                    <div className="flex flex-col items-start gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Bot Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-md px-3 py-2 text-sm bg-secondary text-secondary-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-border">
        {suggestedMessages.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {suggestedMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
