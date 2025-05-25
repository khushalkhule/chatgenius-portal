
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseService } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused';
  conversations: number;
  leads: number;
  design?: any;
  ai_model?: any;
  lead_form?: any;
  created_at: string;
  updated_at: string;
}

interface ChatbotContextType {
  chatbots: Chatbot[];
  loading: boolean;
  error: string | null;
  getChatbot: (id: string) => Chatbot | undefined;
  createChatbot: (chatbot: Omit<Chatbot, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Chatbot | null>;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => Promise<Chatbot | null>;
  deleteChatbot: (id: string) => Promise<boolean>;
  refreshChatbots: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshChatbots = async () => {
    if (!user) {
      setChatbots([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userChatbots = await supabaseService.chatbots.getUserChatbots(user.id);
      setChatbots(userChatbots);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch chatbots:", err);
      setError("Failed to load chatbots. Please try again later.");
      setChatbots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshChatbots();
  }, [user]);

  const getChatbot = (id: string): Chatbot | undefined => {
    return chatbots.find(chatbot => chatbot.id === id);
  };

  const createChatbot = async (chatbotData: Omit<Chatbot, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Chatbot | null> => {
    if (!user) {
      toast.error("You must be logged in to create a chatbot");
      return null;
    }

    try {
      const newChatbot = await supabaseService.chatbots.createChatbot({
        ...chatbotData,
        user_id: user.id,
        conversations: 0,
        leads: 0
      });

      setChatbots(prev => [newChatbot, ...prev]);
      toast.success("Chatbot created successfully!");
      return newChatbot;
    } catch (err) {
      console.error("Failed to create chatbot:", err);
      toast.error("Failed to create chatbot. Please try again.");
      return null;
    }
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>): Promise<Chatbot | null> => {
    try {
      const updatedChatbot = await supabaseService.chatbots.updateChatbot(id, updates);
      
      setChatbots(prev => 
        prev.map(chatbot => 
          chatbot.id === id ? updatedChatbot : chatbot
        )
      );

      toast.success("Chatbot updated successfully!");
      return updatedChatbot;
    } catch (err) {
      console.error("Failed to update chatbot:", err);
      toast.error("Failed to update chatbot. Please try again.");
      return null;
    }
  };

  const deleteChatbot = async (id: string): Promise<boolean> => {
    try {
      await supabaseService.chatbots.deleteChatbot(id);
      
      setChatbots(prev => prev.filter(chatbot => chatbot.id !== id));
      toast.success("Chatbot deleted successfully!");
      return true;
    } catch (err) {
      console.error("Failed to delete chatbot:", err);
      toast.error("Failed to delete chatbot. Please try again.");
      return false;
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        chatbots,
        loading,
        error,
        getChatbot,
        createChatbot,
        updateChatbot,
        deleteChatbot,
        refreshChatbots,
      }}
    >
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
