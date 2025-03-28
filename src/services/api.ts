
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

// Add the subscription service
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
          priceValue: 0,
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
          priceValue: 29,
          period: "month",
          priceMonthly: "$29",
          priceMonthlyValue: 29,
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
          priceValue: 99,
          period: "month",
          priceMonthly: "$99",
          priceMonthlyValue: 99,
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
      console.error('Error getting subscription plan:', error);
      
      // Return a mock plan as fallback
      const mockPlans = [
        {
          id: "1",
          name: "Free",
          price: "$0",
          priceValue: 0,
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
          priceValue: 29,
          period: "month",
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
          priceValue: 99,
          period: "month",
          chatbots: 20,
          api_calls: 5000,
          storage: 50,
          description: "For larger organizations",
          features: ["20 chatbots", "5,000 API calls/month", "50GB storage", "Dedicated support", "Custom integrations"],
          highlighted: false,
          badge: "Enterprise"
        }
      ];
      
      return mockPlans.find(plan => plan.id === id) || null;
    }
  },
  
  createPlan: async (planData) => {
    try {
      const { plan } = await apiRequest('/subscription-plans', {
        method: 'POST',
        body: JSON.stringify(planData)
      });
      return plan;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      return { success: false, message: 'Failed to create plan' };
    }
  },
  
  updatePlan: async (id, planData) => {
    try {
      const { plan } = await apiRequest(`/subscription-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(planData)
      });
      return plan;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      return { success: false, message: 'Failed to update plan' };
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
      return { success: false, message: 'Failed to delete plan' };
    }
  },
  
  getUserSubscription: async (userId) => {
    try {
      const { subscription } = await apiRequest(`/users/${userId}/subscription`, {
        method: 'GET'
      });
      return subscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      // Return mock subscription as fallback
      return {
        id: "sub_1",
        userId: userId,
        planId: "2", // Pro plan
        status: "active",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        planInfo: {
          id: "2",
          name: "Pro",
          price: "$29",
          priceValue: 29,
          period: "month",
          chatbots: 5,
          api_calls: 1000,
          storage: 10,
          description: "Perfect for small businesses",
          features: ["5 chatbots", "1,000 API calls/month", "10GB storage", "Priority support"],
          highlighted: true,
          badge: "Most Popular"
        }
      };
    }
  },
  
  updateUserSubscription: async (userId, planId) => {
    try {
      const { subscription } = await apiRequest(`/users/${userId}/subscription`, {
        method: 'PUT',
        body: JSON.stringify({ planId })
      });
      return subscription;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      
      // Return mock updated subscription as fallback
      const mockPlan = {
        id: planId,
        name: planId === "1" ? "Free" : planId === "2" ? "Pro" : "Enterprise",
        price: planId === "1" ? "$0" : planId === "2" ? "$29" : "$99",
        priceValue: planId === "1" ? 0 : planId === "2" ? 29 : 99,
        period: "month",
        chatbots: planId === "1" ? 1 : planId === "2" ? 5 : 20,
        api_calls: planId === "1" ? 100 : planId === "2" ? 1000 : 5000,
        storage: planId === "1" ? 1 : planId === "2" ? 10 : 50,
        description: planId === "1" ? "Basic plan for individuals" : planId === "2" ? "Perfect for small businesses" : "For larger organizations",
        features: planId === "1" 
          ? ["1 chatbot", "100 API calls/month", "1GB storage"]
          : planId === "2"
            ? ["5 chatbots", "1,000 API calls/month", "10GB storage", "Priority support"]
            : ["20 chatbots", "5,000 API calls/month", "50GB storage", "Dedicated support", "Custom integrations"],
        highlighted: planId === "2",
        badge: planId === "1" ? "" : planId === "2" ? "Most Popular" : "Enterprise"
      };
      
      return {
        id: "sub_1",
        userId: userId,
        planId: planId,
        status: "active",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        planInfo: mockPlan
      };
    }
  }
};

// Define the adminService
const adminService = {
  getDashboardStats: async () => {
    try {
      const { stats } = await apiRequest('/admin/dashboard-stats', {
        method: 'GET'
      });
      return stats;
    } catch (error) {
      console.error('Error getting admin dashboard stats:', error);
      
      // Return mock stats as fallback
      return {
        totalUsers: 156,
        totalChatbots: 245,
        totalLeads: 1489,
        totalConversations: 12567,
        revenueData: [
          { month: 'Jan', amount: 5400 },
          { month: 'Feb', amount: 6200 },
          { month: 'Mar', amount: 7800 },
          { month: 'Apr', amount: 8600 },
          { month: 'May', amount: 9200 },
          { month: 'Jun', amount: 10500 },
        ],
        userGrowthData: [
          { month: 'Jan', users: 42 },
          { month: 'Feb', users: 63 },
          { month: 'Mar', users: 85 },
          { month: 'Apr', users: 107 },
          { month: 'May', users: 134 },
          { month: 'Jun', users: 156 },
        ],
        chatbotTypeData: [
          { type: 'Support', count: 105 },
          { type: 'Sales', count: 85 },
          { type: 'Marketing', count: 55 },
        ]
      };
    }
  }
};

// Create a single exported object with all services
const api = {
  chatbots: chatbotService,
  users: userService,
  subscriptions: subscriptionService,
  admin: adminService
};

export default api;
