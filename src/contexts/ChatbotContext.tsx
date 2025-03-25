
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "sonner";

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused";
  conversations: number;
  leads: number;
  createdAt: string;
  basicInfo?: any;
  knowledgeBase?: any;
  aiModel?: any;
  design?: any;
  leadForm?: any;
}

interface ApiSuccessResponseWithData {
  success: boolean;
  data: any;
  message?: string;
}

interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

interface ChatbotContextType {
  chatbots: Chatbot[];
  isLoading: boolean;
  error: string | null;
  addChatbot: (chatbot: Omit<Chatbot, "id" | "createdAt" | "conversations" | "leads" | "status">) => Promise<Chatbot>;
  getChatbot: (id: string) => Chatbot | undefined;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => Promise<void>;
  deleteChatbot: (id: string) => Promise<void>;
  refreshChatbots: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatbots = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      const response = await api.chatbots.getAllChatbots(userId) as ApiSuccessResponseWithData;
      if (response.success) {
        setChatbots(response.data);
      } else {
        const errorMessage = response.message || "Failed to fetch chatbots";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const refreshChatbots = async () => {
    await fetchChatbots();
  };

  const addChatbot = async (newChatbot: Omit<Chatbot, "id" | "createdAt" | "conversations" | "leads" | "status">) => {
    try {
      setIsLoading(true);
      const response = await api.chatbots.createChatbot(newChatbot) as ApiSuccessResponseWithData;
      
      if (response.success) {
        setChatbots(prev => [...prev, response.data]);
        toast.success("Chatbot created successfully!");
        return response.data;
      } else {
        const errorMessage = response.message || "Failed to create chatbot";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create chatbot";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatbot = (id: string) => {
    return chatbots.find(chatbot => chatbot.id === id);
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>) => {
    try {
      const response = await api.chatbots.updateChatbot(id, updates) as ApiSuccessResponseWithData;
      
      if (response.success) {
        setChatbots(prev => 
          prev.map(chatbot => 
            chatbot.id === id ? { ...chatbot, ...updates } : chatbot
          )
        );
      } else {
        const errorMessage = response.message || "Failed to update chatbot";
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update chatbot";
      toast.error(errorMessage);
    }
  };

  const deleteChatbot = async (id: string) => {
    try {
      const response = await api.chatbots.deleteChatbot(id) as ApiSuccessResponse;
      
      if (response.success) {
        setChatbots(prev => prev.filter(chatbot => chatbot.id !== id));
        toast.success("Chatbot deleted successfully");
      } else {
        const errorMessage = response.message || "Failed to delete chatbot";
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete chatbot";
      toast.error(errorMessage);
    }
  };

  return (
    <ChatbotContext.Provider value={{
      chatbots,
      isLoading,
      error,
      addChatbot,
      getChatbot,
      updateChatbot,
      deleteChatbot,
      refreshChatbots
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbots = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbots must be used within a ChatbotProvider");
  }
  return context;
};
