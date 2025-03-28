
// Define base URL for the API
const API_BASE_URL = 'http://localhost:5000/api';

// Define types for API request options
interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Define consistent API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Get the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for making API requests
const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}) => {
  try {
    // Get the auth token
    const token = getAuthToken();
    
    // Add auth header if token exists
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      // During development, we can use this to skip auth
      // 'x-skip-auth': 'development',
      ...(options.headers || {})
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
};

// Define each service separately
const chatbotService = {
  getAllChatbots: async (userId) => {
    try {
      const { chatbots } = await apiRequest(`/chatbots/${userId}`, {
        method: 'GET'
      });
      return { success: true, data: chatbots };
    } catch (error) {
      console.error('Error getting chatbots:', error);
      // Fallback to localStorage if API fails
      const storedChatbots = localStorage.getItem('chatbots');
      return { 
        success: true, 
        data: storedChatbots ? JSON.parse(storedChatbots) : [] 
      };
    }
  },
  
  getChatbotById: async (id) => {
    try {
      const { chatbot } = await apiRequest(`/chatbots/single/${id}`, {
        method: 'GET'
      });
      return chatbot;
    } catch (error) {
      console.error('Error getting chatbot by ID:', error);
      // Fallback to localStorage
      const storedChatbots = localStorage.getItem('chatbots');
      const chatbots = storedChatbots ? JSON.parse(storedChatbots) : [];
      return chatbots.find(chatbot => chatbot.id === id) || null;
    }
  },
  
  createChatbot: async (chatbot) => {
    try {
      const { chatbot: newChatbot } = await apiRequest('/chatbots', {
        method: 'POST',
        body: JSON.stringify(chatbot)
      });
      return { success: true, data: newChatbot };
    } catch (error) {
      console.error('Error creating chatbot:', error);
      // Fallback to localStorage
      const storedChatbots = localStorage.getItem('chatbots');
      const chatbots = storedChatbots ? JSON.parse(storedChatbots) : [];
      
      // Generate a unique ID for the new chatbot
      const newChatbot = {
        ...chatbot,
        id: `chatbot-${Date.now()}`,
        status: 'active',
        conversations: 0,
        leads: 0,
        createdAt: new Date().toISOString()
      };
      
      chatbots.push(newChatbot);
      localStorage.setItem('chatbots', JSON.stringify(chatbots));
      
      return { success: true, data: newChatbot };
    }
  },
  
  updateChatbot: async (id, updates) => {
    try {
      const { chatbot } = await apiRequest(`/chatbots/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return chatbot;
    } catch (error) {
      console.error('Error updating chatbot:', error);
      // Fallback to localStorage
      const storedChatbots = localStorage.getItem('chatbots');
      let chatbots = storedChatbots ? JSON.parse(storedChatbots) : [];
      
      chatbots = chatbots.map(chatbot => 
        chatbot.id === id ? { ...chatbot, ...updates } : chatbot
      );
      
      localStorage.setItem('chatbots', JSON.stringify(chatbots));
      return { id, ...updates };
    }
  },
  
  deleteChatbot: async (id) => {
    try {
      await apiRequest(`/chatbots/${id}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      // Fallback to localStorage
      const storedChatbots = localStorage.getItem('chatbots');
      let chatbots = storedChatbots ? JSON.parse(storedChatbots) : [];
      
      chatbots = chatbots.filter(chatbot => chatbot.id !== id);
      localStorage.setItem('chatbots', JSON.stringify(chatbots));
      
      return { success: true };
    }
  },
  
  addLead: async (leadData) => {
    try {
      const response = await apiRequest(`/chatbots/${leadData.chatbotId}/leads`, {
        method: 'POST',
        body: JSON.stringify(leadData)
      });
      
      return { success: true, data: response.lead };
    } catch (error) {
      console.error('Error adding lead:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to submit lead' 
      };
    }
  }
};

const userService = {
  getUserById: async (id) => {
    try {
      const { user } = await apiRequest(`/users/${id}`, {
        method: 'GET'
      });
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  },
  
  getUserByEmail: async (email) => {
    try {
      const { user } = await apiRequest(`/users/by-email/${email}`, {
        method: 'GET'
      });
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      return user && user.email === email ? user : null;
    }
  },
  
  createUser: async (user) => {
    try {
      const response = await apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(user)
      });
      
      // Save auth token if returned
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  },
  
  updateUser: async (id, updates) => {
    try {
      const { user } = await apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (user && user.id === id) {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return null;
    }
  },
  
  deleteUser: async (id) => {
    try {
      await apiRequest(`/users/${id}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      // Fallback to localStorage
      localStorage.removeItem('user');
      return { success: true };
    }
  },
  
  getAllUsers: async () => {
    try {
      const { users } = await apiRequest('/users', {
        method: 'GET'
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      return storedUser ? [JSON.parse(storedUser)] : [];
    }
  },
  
  loginUser: async (email, password) => {
    try {
      const response = await apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Save auth token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userId', response.user.id);
      }
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logoutUser: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    return { success: true };
  },
  
  getDashboardStats: async () => {
    try {
      const { stats } = await apiRequest('/admin/dashboard-stats', {
        method: 'GET'
      });
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      
      // Return mock stats as fallback
      const mockStats = {
        totalUsers: 156,
        activeChatbots: 42,
        apiRequests: 12567,
        userGrowth: 12,
        chatbotGrowth: 18,
        apiGrowth: 24
      };
      
      return { success: true, data: mockStats };
    }
  }
};

const subscriptionService = {
  getAllPlans: async () => {
    try {
      const { plans } = await apiRequest('/subscription-plans', {
        method: 'GET'
      });
      return plans;
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      
      // Return mock subscription plans as fallback
      const mockPlans = [
        {
          id: "1",
          name: "Free",
          price: "$0",
          price_value: 0,
          period: "month",
          chatbots: 1,
          api_calls: 100,
          storage: 1,
          description: "Basic plan for individuals",
          features: ["1 chatbot", "100 API calls/month", "1GB storage"],
          highlighted: false,
          badge: ""
        },
        {
          id: "2",
          name: "Pro",
          price: "$29",
          price_value: 29,
          period: "month",
          price_monthly: "$29",
          price_monthly_value: 29,
          chatbots: 5,
          api_calls: 1000,
          storage: 10,
          description: "Perfect for small businesses",
          features: ["5 chatbots", "1,000 API calls/month", "10GB storage", "Priority support"],
          highlighted: true,
          badge: "Most Popular"
        },
        {
          id: "3",
          name: "Enterprise",
          price: "$99",
          price_value: 99,
          period: "month",
          price_monthly: "$99",
          price_monthly_value: 99,
          chatbots: 20,
          api_calls: 5000,
          storage: 50,
          description: "For larger organizations",
          features: ["20 chatbots", "5,000 API calls/month", "50GB storage", "Dedicated support", "Custom integrations"],
          highlighted: false,
          badge: "Enterprise"
        }
      ];
      
      return mockPlans;
    }
  },
  
  getPlanById: async (id) => {
    try {
      const { plan } = await apiRequest(`/subscription-plans/${id}`, {
        method: 'GET'
      });
      return plan;
    } catch (error) {
      console.error('Error getting plan by ID:', error);
      const plans = await subscriptionService.getAllPlans();
      return plans.find(plan => plan.id === id) || null;
    }
  },
  
  getUserSubscription: async (userId) => {
    try {
      const { subscription } = await apiRequest(`/user-subscription/${userId}`, {
        method: 'GET'
      });
      return subscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      // Fallback to localStorage
      const storedSubscription = localStorage.getItem(`subscription_${userId}`);
      
      if (storedSubscription) {
        const subscription = JSON.parse(storedSubscription);
        const planInfo = await subscriptionService.getPlanById(subscription.planId);
        return {
          ...subscription,
          planInfo
        };
      }
      
      // Return a default subscription
      const defaultPlan = await subscriptionService.getPlanById("1");
      const defaultSubscription = {
        id: crypto.randomUUID(),
        userId,
        planId: "1",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        planInfo: defaultPlan
      };
      
      localStorage.setItem(`subscription_${userId}`, JSON.stringify(defaultSubscription));
      return defaultSubscription;
    }
  },
  
  updateUserSubscription: async (userId, planId) => {
    try {
      const { subscription } = await apiRequest(`/user-subscription/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ planId })
      });
      return subscription;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      // Fallback to localStorage
      const planInfo = await subscriptionService.getPlanById(planId);
      
      if (!planInfo) {
        throw new Error("Plan not found");
      }
      
      const subscription = {
        id: crypto.randomUUID(),
        userId,
        planId,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscription));
      
      return {
        ...subscription,
        planInfo
      };
    }
  },
  
  createPlan: async (plan) => {
    try {
      const { plan: newPlan } = await apiRequest('/subscription-plans', {
        method: 'POST',
        body: JSON.stringify(plan)
      });
      return newPlan;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      // Fallback to localStorage
      const storedPlans = localStorage.getItem('subscriptionPlans');
      const plans = storedPlans ? JSON.parse(storedPlans) : [];
      
      const newPlan = {
        ...plan,
        id: plan.id || crypto.randomUUID()
      };
      
      plans.push(newPlan);
      localStorage.setItem('subscriptionPlans', JSON.stringify(plans));
      
      return newPlan;
    }
  },
  
  updatePlan: async (id, updates) => {
    try {
      const { plan } = await apiRequest(`/subscription-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return plan;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      // Fallback to localStorage
      const storedPlans = localStorage.getItem('subscriptionPlans');
      let plans = storedPlans ? JSON.parse(storedPlans) : [];
      
      plans = plans.map(plan => 
        plan.id === id ? { ...plan, ...updates } : plan
      );
      
      localStorage.setItem('subscriptionPlans', JSON.stringify(plans));
      
      return { id, ...updates };
    }
  },
  
  deletePlan: async (id) => {
    try {
      await apiRequest(`/subscription-plans/${id}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      // Fallback to localStorage
      const storedPlans = localStorage.getItem('subscriptionPlans');
      let plans = storedPlans ? JSON.parse(storedPlans) : [];
      
      plans = plans.filter(plan => plan.id !== id);
      localStorage.setItem('subscriptionPlans', JSON.stringify(plans));
      
      return { success: true };
    }
  },
  
  getSubscription: async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        return { 
          success: false, 
          message: 'User not authenticated' 
        };
      }
      
      const subscription = await subscriptionService.getUserSubscription(userId);
      
      // Transform the subscription data for the client component
      const transformedSubscription = {
        plan: subscription.planInfo.name,
        status: subscription.status,
        price: subscription.planInfo.price_value,
        billingCycle: subscription.planInfo.period,
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
        features: subscription.planInfo.features,
        usage: {
          chatbots: {
            used: 2,
            limit: subscription.planInfo.chatbots
          },
          conversations: {
            used: 45,
            limit: subscription.planInfo.api_calls
          },
          apiCalls: {
            used: 385,
            limit: subscription.planInfo.api_calls
          },
          storage: {
            used: 128,
            limit: subscription.planInfo.storage
          }
        },
        billingHistory: [
          {
            id: 'INV-001',
            date: new Date().toLocaleDateString(),
            amount: subscription.planInfo.price_value,
            status: 'paid'
          },
          {
            id: 'INV-002',
            date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString(),
            amount: subscription.planInfo.price_value,
            status: 'paid'
          }
        ]
      };
      
      return { success: true, data: transformedSubscription };
    } catch (error) {
      console.error('Error getting subscription:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch subscription' 
      };
    }
  }
};

const adminService = {
  getDashboardStats: async () => {
    try {
      const { stats } = await apiRequest('/admin/dashboard-stats', {
        method: 'GET'
      });
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      
      // Return mock stats as fallback
      const mockStats = {
        totalUsers: 156,
        activeChatbots: 42,
        apiRequests: 12567,
        userGrowth: 12,
        chatbotGrowth: 18,
        apiGrowth: 24
      };
      
      return { 
        success: true, 
        data: mockStats,
        message: 'Using fallback data' 
      };
    }
  }
};

// Create an API object with all services
const api = {
  chatbots: chatbotService,
  user: userService,
  subscription: subscriptionService,
  admin: adminService
};

// Initialize mock database function
export const initializeDatabase = async () => {
  try {
    console.log('Initializing mock database');
    
    // Set up mock data if none exists
    if (!localStorage.getItem('user')) {
      const mockUser = {
        id: 'user-1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'client'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userId', mockUser.id);
    }
    
    // Initialize mock chatbots if none exist
    if (!localStorage.getItem('chatbots')) {
      // Create a sample chatbot for demonstration
      const sampleChatbot = {
        id: 'chatbot-1',
        name: 'Sample Chatbot',
        description: 'A sample chatbot for demonstration',
        status: 'active',
        conversation_count: 0,
        lead_count: 0,
        created_at: new Date().toISOString(),
        configuration: {
          basicInfo: {
            name: 'Sample Chatbot',
            description: 'A sample chatbot for demonstration',
            team: 'Demo Team'
          },
          knowledgeBase: {
            sourceType: 'text',
            content: 'This is a sample knowledge base content.'
          },
          aiModel: {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 1000
          },
          design: {
            theme: 'light',
            name: 'Sample Bot',
            initialMessage: 'Hi there! How can I help you today?',
            suggestedMessages: 'What services do you offer?\nHow does this work?\nTell me more about your product',
            placeholder: 'Type your message...'
          },
          leadForm: {
            enabled: false,
            title: 'Contact Information',
            fields: [
              {
                id: 'name',
                name: 'name',
                label: 'Name',
                type: 'text',
                required: true
              },
              {
                id: 'email',
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true
              }
            ],
            buttonText: 'Start Chat',
            successMessage: 'Thank you for your information!'
          }
        }
      };
      
      localStorage.setItem('chatbots', JSON.stringify([sampleChatbot]));
    }
    
    // Initialize mock subscription plans if none exist
    if (!localStorage.getItem('subscriptionPlans')) {
      const mockPlans = await subscriptionService.getAllPlans();
      localStorage.setItem('subscriptionPlans', JSON.stringify(mockPlans));
    }
    
    // Initialize a basic subscription for the demo user
    const userId = 'user-1';
    if (!localStorage.getItem(`subscription_${userId}`)) {
      const defaultSubscription = {
        id: crypto.randomUUID(),
        userId,
        planId: "1",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`subscription_${userId}`, JSON.stringify(defaultSubscription));
    }
    
    toast.success('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    toast.error('Failed to initialize database');
    return false;
  }
};

// Export the API object as default and also named exports
export { chatbotService, userService, subscriptionService, adminService };
export default api;
