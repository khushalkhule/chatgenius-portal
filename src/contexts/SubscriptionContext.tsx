
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseService } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  period: string;
  priceMonthly?: string;
  priceMonthlyValue?: number;
  chatbots: number;
  apiCalls: number;
  storage: number;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'trial' | 'expired';
  createdAt: string;
  updatedAt: string;
  planInfo?: SubscriptionPlan;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription | null;
  getUserSubscription: (userId: string) => Promise<UserSubscription | null>;
  updateUserSubscription: (userId: string, planId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const result = await supabaseService.subscriptions.getAllPlans();
        
        const formattedPlans = result.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          priceValue: Number(plan.price_value || 0),
          period: plan.period,
          priceMonthly: plan.price_monthly,
          priceMonthlyValue: plan.price_monthly_value ? 
            Number(plan.price_monthly_value) : undefined,
          chatbots: Number(plan.chatbots),
          apiCalls: Number(plan.api_calls || 0),
          storage: Number(plan.storage),
          description: plan.description || '',
          features: Array.isArray(plan.features) ? plan.features : [],
          highlighted: Boolean(plan.highlighted),
          badge: plan.badge || ''
        }));
        
        setPlans(formattedPlans);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setError("Failed to load subscription plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!user) {
        setCurrentSubscription(null);
        return;
      }

      try {
        const subscription = await supabaseService.subscriptions.getUserSubscription(user.id);
        if (subscription) {
          const formattedSubscription: UserSubscription = {
            id: subscription.id,
            userId: subscription.user_id,
            planId: subscription.plan_id,
            status: subscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
            createdAt: subscription.created_at,
            updatedAt: subscription.updated_at,
            planInfo: subscription.plan ? {
              id: subscription.plan.id,
              name: subscription.plan.name,
              price: subscription.plan.price,
              priceValue: Number(subscription.plan.price_value || 0),
              period: subscription.plan.period,
              priceMonthly: subscription.plan.price_monthly,
              priceMonthlyValue: subscription.plan.price_monthly_value ? 
                Number(subscription.plan.price_monthly_value) : undefined,
              chatbots: Number(subscription.plan.chatbots),
              apiCalls: Number(subscription.plan.api_calls || 0),
              storage: Number(subscription.plan.storage),
              description: subscription.plan.description || '',
              features: Array.isArray(subscription.plan.features) ? subscription.plan.features : [],
              highlighted: Boolean(subscription.plan.highlighted),
              badge: subscription.plan.badge || ''
            } : undefined
          };
          
          setCurrentSubscription(formattedSubscription);
        }
      } catch (err) {
        console.error("Failed to get user subscription:", err);
      }
    };

    fetchUserSubscription();
  }, [user]);

  const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
    try {
      const subscription = await supabaseService.subscriptions.getUserSubscription(userId);
      if (subscription) {
        const formattedSubscription: UserSubscription = {
          id: subscription.id,
          userId: subscription.user_id,
          planId: subscription.plan_id,
          status: subscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
          createdAt: subscription.created_at,
          updatedAt: subscription.updated_at,
          planInfo: subscription.plan ? {
            id: subscription.plan.id,
            name: subscription.plan.name,
            price: subscription.plan.price,
            priceValue: Number(subscription.plan.price_value || 0),
            period: subscription.plan.period,
            priceMonthly: subscription.plan.price_monthly,
            priceMonthlyValue: subscription.plan.price_monthly_value ? 
              Number(subscription.plan.price_monthly_value) : undefined,
            chatbots: Number(subscription.plan.chatbots),
            apiCalls: Number(subscription.plan.api_calls || 0),
            storage: Number(subscription.plan.storage),
            description: subscription.plan.description || '',
            features: Array.isArray(subscription.plan.features) ? subscription.plan.features : [],
            highlighted: Boolean(subscription.plan.highlighted),
            badge: subscription.plan.badge || ''
          } : undefined
        };
        
        setCurrentSubscription(formattedSubscription);
        return formattedSubscription;
      }
      return null;
    } catch (err) {
      console.error("Failed to get user subscription:", err);
      setError("Failed to retrieve subscription information.");
      return null;
    }
  };
  
  const updateUserSubscription = async (userId: string, planId: string) => {
    try {
      await supabaseService.subscriptions.updateUserSubscription(userId, planId);
      
      // Refresh the user's subscription
      await getUserSubscription(userId);
      
      toast.success("Subscription updated successfully!");
    } catch (err) {
      console.error("Failed to update subscription:", err);
      setError("Failed to update subscription. Please try again.");
      toast.error("Failed to update subscription. Please try again.");
      throw err;
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      plans,
      currentSubscription,
      getUserSubscription,
      updateUserSubscription,
      loading,
      error
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscriptions must be used within a SubscriptionProvider");
  }
  return context;
};
