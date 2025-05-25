
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Chatbot = Tables['chatbots']['Row'];
type KnowledgeBase = Tables['knowledge_bases']['Row'];
type SubscriptionPlan = Tables['subscription_plans']['Row'];
type UserSubscription = Tables['user_subscriptions']['Row'];
type Lead = Tables['leads']['Row'];

export const supabaseService = {
  // Auth functions
  auth: {
    signUp: async (email: string, password: string, fullName?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      return data;
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    getCurrentUser: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  },

  // Profile functions
  profiles: {
    getProfile: async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    updateProfile: async (userId: string, updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Chatbots functions
  chatbots: {
    getUserChatbots: async (userId: string): Promise<Chatbot[]> => {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    getChatbotById: async (id: string): Promise<Chatbot | null> => {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    createChatbot: async (chatbot: Omit<Chatbot, 'id' | 'created_at' | 'updated_at'>): Promise<Chatbot> => {
      const { data, error } = await supabase
        .from('chatbots')
        .insert(chatbot)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    updateChatbot: async (id: string, updates: Partial<Omit<Chatbot, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Chatbot> => {
      const { data, error } = await supabase
        .from('chatbots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    deleteChatbot: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Knowledge bases functions
  knowledgeBases: {
    getByMacChatbotId: async (chatbotId: string): Promise<KnowledgeBase[]> => {
      const { data, error } = await supabase
        .from('knowledge_bases')
        .select(`
          *,
          knowledge_base_urls(*),
          knowledge_base_faqs(*)
        `)
        .eq('chatbot_id', chatbotId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    createKnowledgeBase: async (kb: Omit<KnowledgeBase, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeBase> => {
      const { data, error } = await supabase
        .from('knowledge_bases')
        .insert(kb)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    addUrls: async (knowledgeBaseId: string, urls: string[]): Promise<void> => {
      const urlData = urls.map(url => ({
        knowledge_base_id: knowledgeBaseId,
        url,
        status: 'pending' as const
      }));

      const { error } = await supabase
        .from('knowledge_base_urls')
        .insert(urlData);
      
      if (error) throw error;
    },

    addFaqs: async (knowledgeBaseId: string, faqs: { question: string; answer: string }[]): Promise<void> => {
      const faqData = faqs.map(faq => ({
        knowledge_base_id: knowledgeBaseId,
        question: faq.question,
        answer: faq.answer
      }));

      const { error } = await supabase
        .from('knowledge_base_faqs')
        .insert(faqData);
      
      if (error) throw error;
    }
  },

  // Subscription functions
  subscriptions: {
    getAllPlans: async (): Promise<SubscriptionPlan[]> => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_value', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    getUserSubscription: async (userId: string): Promise<(UserSubscription & { plan: SubscriptionPlan }) | null> => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    updateUserSubscription: async (userId: string, planId: string): Promise<UserSubscription> => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Leads functions
  leads: {
    getChatbotLeads: async (chatbotId: string): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    createLead: async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};
