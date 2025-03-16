import React, { createContext, useContext, useState, useEffect } from "react";
import { subscriptionService } from "@/services/api";
import { toast } from "sonner";

// Define the subscription plan type
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

  // Fetch subscription plans on initial render
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const result = await subscriptionService.getAllPlans();
        
        // Transform database result to match our SubscriptionPlan interface
        const formattedPlans = result.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          priceValue: Number(plan.priceValue || 0),
          period: plan.period,
          priceMonthly: plan.priceMonthly,
          priceMonthlyValue: plan.priceMonthlyValue ? 
            Number(plan.priceMonthlyValue) : undefined,
          chatbots: Number(plan.chatbots),
          apiCalls: Number(plan.api_calls || 0),
          storage: Number(plan.storage),
          description: plan.description || '',
          features: Array.isArray(plan.features) ? plan.features : [],
          highlighted: Boolean(plan.highlighted),
          badge: plan.badge || ''
        }));
        
        setPlans(formattedPlans);
        
        // Try to get current user's subscription
        const userId = localStorage.getItem("userId");
        if (userId) {
          const subscription = await subscriptionService.getUserSubscription(userId);
          if (subscription) {
            // Transform to match UserSubscription interface
            const formattedSubscription: UserSubscription = {
              id: subscription.id,
              userId: subscription.userId,
              planId: subscription.planId,
              status: subscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
              createdAt: subscription.createdAt,
              updatedAt: subscription.updatedAt,
              planInfo: subscription.planInfo ? {
                id: subscription.planInfo.id,
                name: subscription.planInfo.name,
                price: subscription.planInfo.price,
                priceValue: Number(subscription.planInfo.priceValue || 0),
                period: subscription.planInfo.period,
                priceMonthly: subscription.planInfo.priceMonthly,
                priceMonthlyValue: subscription.planInfo.priceMonthlyValue ? 
                  Number(subscription.planInfo.priceMonthlyValue) : undefined,
                chatbots: Number(subscription.planInfo.chatbots),
                apiCalls: Number(subscription.planInfo.api_calls || 0),
                storage: Number(subscription.planInfo.storage),
                description: subscription.planInfo.description || '',
                features: Array.isArray(subscription.planInfo.features) ? subscription.planInfo.features : [],
                highlighted: Boolean(subscription.planInfo.highlighted),
                badge: subscription.planInfo.badge || ''
              } : undefined
            };
            
            setCurrentSubscription(formattedSubscription);
          }
        }
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setError("Failed to load subscription plans. Please try again later.");
        
        // Fallback to localStorage if database fails
        const savedPlans = localStorage.getItem("subscriptionPlans");
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Save plans to localStorage as a backup
  useEffect(() => {
    if (!loading && plans.length > 0) {
      localStorage.setItem("subscriptionPlans", JSON.stringify(plans));
    }
  }, [plans, loading]);

  const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
    try {
      const subscription = await subscriptionService.getUserSubscription(userId);
      if (subscription) {
        // Transform to match UserSubscription interface
        const formattedSubscription: UserSubscription = {
          id: subscription.id,
          userId: subscription.userId,
          planId: subscription.planId,
          status: subscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
          planInfo: subscription.planInfo ? {
            id: subscription.planInfo.id,
            name: subscription.planInfo.name,
            price: subscription.planInfo.price,
            priceValue: Number(subscription.planInfo.priceValue || 0),
            period: subscription.planInfo.period,
            priceMonthly: subscription.planInfo.priceMonthly,
            priceMonthlyValue: subscription.planInfo.priceMonthlyValue ? 
              Number(subscription.planInfo.priceMonthlyValue) : undefined,
            chatbots: Number(subscription.planInfo.chatbots),
            apiCalls: Number(subscription.planInfo.api_calls || 0),
            storage: Number(subscription.planInfo.storage),
            description: subscription.planInfo.description || '',
            features: Array.isArray(subscription.planInfo.features) ? subscription.planInfo.features : [],
            highlighted: Boolean(subscription.planInfo.highlighted),
            badge: subscription.planInfo.badge || ''
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
      const updatedSubscription = await subscriptionService.updateUserSubscription(userId, planId);
      if (updatedSubscription) {
        // Transform to match UserSubscription interface
        const formattedSubscription: UserSubscription = {
          id: updatedSubscription.id,
          userId: updatedSubscription.userId,
          planId: updatedSubscription.planId,
          status: updatedSubscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
          createdAt: updatedSubscription.createdAt,
          updatedAt: updatedSubscription.updatedAt,
          planInfo: updatedSubscription.planInfo ? {
            id: updatedSubscription.planInfo.id,
            name: updatedSubscription.planInfo.name,
            price: updatedSubscription.planInfo.price,
            priceValue: Number(updatedSubscription.planInfo.priceValue || 0),
            period: updatedSubscription.planInfo.period,
            priceMonthly: updatedSubscription.planInfo.priceMonthly,
            priceMonthlyValue: updatedSubscription.planInfo.priceMonthlyValue ? 
              Number(updatedSubscription.planInfo.priceMonthlyValue) : undefined,
            chatbots: Number(updatedSubscription.planInfo.chatbots),
            apiCalls: Number(updatedSubscription.planInfo.api_calls || 0),
            storage: Number(updatedSubscription.planInfo.storage),
            description: updatedSubscription.planInfo.description || '',
            features: Array.isArray(updatedSubscription.planInfo.features) ? updatedSubscription.planInfo.features : [],
            highlighted: Boolean(updatedSubscription.planInfo.highlighted),
            badge: updatedSubscription.planInfo.badge || ''
          } : undefined
        };
        
        setCurrentSubscription(formattedSubscription);
      }
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
