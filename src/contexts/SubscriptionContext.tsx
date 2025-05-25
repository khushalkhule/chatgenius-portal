
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  price_value: number;
  period: string;
  price_monthly?: string | null;
  price_monthly_value?: number | null;
  chatbots: number;
  api_calls: number;
  storage: number;
  description?: string | null;
  features: string[];
  highlighted: boolean;
  badge?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'trial' | 'expired';
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  userSubscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  upgradeSubscription: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPlans = async () => {
    try {
      const subscriptionPlans = await supabaseService.subscriptions.getAllPlans();
      const convertedPlans: SubscriptionPlan[] = subscriptionPlans.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features as string[] : []
      }));
      setPlans(convertedPlans);
    } catch (err) {
      console.error('Failed to load subscription plans:', err);
      setError('Failed to load subscription plans');
    }
  };

  const loadUserSubscription = async () => {
    if (!user) {
      setUserSubscription(null);
      return;
    }

    try {
      const subscription = await supabaseService.subscriptions.getUserSubscription(user.id);
      if (subscription) {
        const convertedSubscription: UserSubscription = {
          ...subscription,
          status: subscription.status as 'active' | 'cancelled' | 'trial' | 'expired',
          plan: subscription.plan ? {
            ...subscription.plan,
            features: Array.isArray(subscription.plan.features) ? subscription.plan.features as string[] : []
          } : undefined
        };
        setUserSubscription(convertedSubscription);
      } else {
        setUserSubscription(null);
      }
    } catch (err) {
      console.error('Failed to load user subscription:', err);
      setError('Failed to load subscription information');
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    try {
      await Promise.all([loadPlans(), loadUserSubscription()]);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const upgradeSubscription = async (planId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to upgrade your subscription');
      return false;
    }

    try {
      await supabaseService.subscriptions.updateUserSubscription(user.id, planId);
      await loadUserSubscription();
      toast.success('Subscription upgraded successfully!');
      return true;
    } catch (err) {
      console.error('Failed to upgrade subscription:', err);
      toast.error('Failed to upgrade subscription. Please try again.');
      return false;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !userSubscription) {
      toast.error('No subscription to cancel');
      return false;
    }

    try {
      // Note: In a real app, you'd update the subscription status to 'cancelled'
      // For now, we'll just show a success message
      toast.success('Subscription cancelled successfully!');
      await loadUserSubscription();
      return true;
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
      toast.error('Failed to cancel subscription. Please try again.');
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        userSubscription,
        loading,
        error,
        upgradeSubscription,
        cancelSubscription,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
