
import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

// Database connection configuration
const dbConfig = {
  host: '82.180.143.240',
  port: 3306,
  user: 'u264210823_aireplyrdbuser',
  password: 'E9!ui0xjt@Z9',
  database: 'u264210823_aireplyrdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Generic query function
export const query = async (sql: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Type guard to check if result is a RowDataPacket array
export function isRowDataPacketArray(result: any): result is RowDataPacket[] {
  return Array.isArray(result);
}

// Chatbot specific database functions
export const chatbotService = {
  // Get all chatbots for a user
  getAllChatbots: async (userId: string) => {
    try {
      const sql = 'SELECT * FROM chatbots WHERE user_id = ?';
      const results = await query(sql, [userId]);
      
      // Ensure we return an array even if no results
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getAllChatbots:', error);
      return []; // Return empty array on error
    }
  },
  
  // Get a single chatbot by ID
  getChatbotById: async (id: string) => {
    const sql = 'SELECT * FROM chatbots WHERE id = ?';
    const results = await query(sql, [id]);
    
    // Handle the OkPacket case - check if results is an array
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  },
  
  // Create a new chatbot
  createChatbot: async (chatbot: any) => {
    const sql = `
      INSERT INTO chatbots (id, user_id, name, description, status, configuration) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      chatbot.id,
      chatbot.userId,
      chatbot.name,
      chatbot.description || '',
      chatbot.status || 'active',
      JSON.stringify(chatbot.configuration || {})
    ];
    
    await query(sql, params);
    return chatbot;
  },
  
  // Update an existing chatbot
  updateChatbot: async (id: string, updates: any) => {
    let sql = 'UPDATE chatbots SET ';
    const params = [];
    const updateFields = [];
    
    // Build dynamic update fields
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.configuration !== undefined) {
      updateFields.push('configuration = ?');
      params.push(JSON.stringify(updates.configuration));
    }
    
    updateFields.push('updated_at = NOW()');
    
    sql += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await query(sql, params);
    return { id, ...updates };
  },
  
  // Delete a chatbot
  deleteChatbot: async (id: string) => {
    const sql = 'DELETE FROM chatbots WHERE id = ?';
    return query(sql, [id]);
  }
};

// User specific database functions
export const userService = {
  // Get user by ID
  getUserById: async (id: string) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  },
  
  // Get user by email
  getUserByEmail: async (email: string) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  },
  
  // Create a new user
  createUser: async (user: any) => {
    const sql = `
      INSERT INTO users (id, email, name, password_hash, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      user.id,
      user.email,
      user.name,
      user.passwordHash,
      user.role || 'client'
    ];
    
    await query(sql, params);
    return user;
  },
  
  // Update an existing user
  updateUser: async (id: string, updates: any) => {
    let sql = 'UPDATE users SET ';
    const params = [];
    const updateFields = [];
    
    // Build dynamic update fields
    if (updates.email !== undefined) {
      updateFields.push('email = ?');
      params.push(updates.email);
    }
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.passwordHash !== undefined) {
      updateFields.push('password_hash = ?');
      params.push(updates.passwordHash);
    }
    if (updates.role !== undefined) {
      updateFields.push('role = ?');
      params.push(updates.role);
    }
    if (updates.profileImage !== undefined) {
      updateFields.push('profile_image = ?');
      params.push(updates.profileImage);
    }
    if (updates.subscriptionTier !== undefined) {
      updateFields.push('subscription_tier = ?');
      params.push(updates.subscriptionTier);
    }
    
    sql += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await query(sql, params);
    return { id, ...updates };
  },
  
  // Delete a user
  deleteUser: async (id: string) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    return query(sql, [id]);
  },
  
  // Get all users (admin only)
  getAllUsers: async () => {
    const sql = 'SELECT * FROM users';
    const results = await query(sql);
    return Array.isArray(results) ? results : [];
  }
};

// Subscription plan specific database functions
export const subscriptionService = {
  // Get all subscription plans
  getAllPlans: async () => {
    try {
      const sql = 'SELECT * FROM subscription_plans ORDER BY price_value ASC';
      const results = await query(sql, []);
      
      // Ensure we return an array even if no results
      if (isRowDataPacketArray(results)) {
        return results.map(plan => ({
          ...plan,
          price_value: Number(plan.price_value),
          price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
          chatbots: Number(plan.chatbots),
          api_calls: Number(plan.api_calls),
          storage: Number(plan.storage),
          features: plan.features ? JSON.parse(plan.features) : []
        }));
      }
      return [];
    } catch (error) {
      console.error('Error in getAllPlans:', error);
      return []; // Return empty array on error
    }
  },
  
  // Get a single plan by ID
  getPlanById: async (id: string) => {
    const sql = 'SELECT * FROM subscription_plans WHERE id = ?';
    const results = await query(sql, [id]);
    
    if (isRowDataPacketArray(results) && results.length > 0) {
      const plan = results[0];
      return {
        ...plan,
        price_value: Number(plan.price_value),
        price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
        chatbots: Number(plan.chatbots),
        api_calls: Number(plan.api_calls),
        storage: Number(plan.storage),
        features: plan.features ? JSON.parse(plan.features) : []
      };
    }
    
    return null;
  },
  
  // Create a new subscription plan
  createPlan: async (plan: any) => {
    const sql = `
      INSERT INTO subscription_plans (
        id, name, price, price_value, period, price_monthly, price_monthly_value,
        chatbots, api_calls, storage, description, features, highlighted, badge
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      plan.id || crypto.randomUUID(),
      plan.name,
      plan.price,
      plan.priceValue,
      plan.period,
      plan.priceMonthly || null,
      plan.priceMonthlyValue || null,
      plan.chatbots,
      plan.apiCalls,
      plan.storage,
      plan.description || '',
      JSON.stringify(plan.features || []),
      plan.highlighted ? 1 : 0,
      plan.badge || ''
    ];
    
    await query(sql, params);
    return plan;
  },
  
  // Update an existing subscription plan
  updatePlan: async (id: string, updates: any) => {
    let sql = 'UPDATE subscription_plans SET ';
    const params = [];
    const updateFields = [];
    
    // Build dynamic update fields
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.price !== undefined) {
      updateFields.push('price = ?');
      params.push(updates.price);
    }
    if (updates.priceValue !== undefined) {
      updateFields.push('price_value = ?');
      params.push(updates.priceValue);
    }
    if (updates.period !== undefined) {
      updateFields.push('period = ?');
      params.push(updates.period);
    }
    if (updates.priceMonthly !== undefined) {
      updateFields.push('price_monthly = ?');
      params.push(updates.priceMonthly);
    }
    if (updates.priceMonthlyValue !== undefined) {
      updateFields.push('price_monthly_value = ?');
      params.push(updates.priceMonthlyValue);
    }
    if (updates.chatbots !== undefined) {
      updateFields.push('chatbots = ?');
      params.push(updates.chatbots);
    }
    if (updates.apiCalls !== undefined) {
      updateFields.push('api_calls = ?');
      params.push(updates.apiCalls);
    }
    if (updates.storage !== undefined) {
      updateFields.push('storage = ?');
      params.push(updates.storage);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.features !== undefined) {
      updateFields.push('features = ?');
      params.push(JSON.stringify(updates.features));
    }
    if (updates.highlighted !== undefined) {
      updateFields.push('highlighted = ?');
      params.push(updates.highlighted ? 1 : 0);
    }
    if (updates.badge !== undefined) {
      updateFields.push('badge = ?');
      params.push(updates.badge);
    }
    
    updateFields.push('updated_at = NOW()');
    
    sql += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await query(sql, params);
    return { id, ...updates };
  },
  
  // Delete a subscription plan
  deletePlan: async (id: string) => {
    const sql = 'DELETE FROM subscription_plans WHERE id = ?';
    return query(sql, [id]);
  },
  
  // Get user subscription
  getUserSubscription: async (userId: string) => {
    const sql = 'SELECT * FROM user_subscriptions WHERE user_id = ?';
    const results = await query(sql, [userId]);
    
    if (isRowDataPacketArray(results) && results.length > 0) {
      const subscription = results[0] as RowDataPacket;
      const planInfo = await subscriptionService.getPlanById(subscription.plan_id);
      
      return {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        status: subscription.status,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at,
        planInfo: planInfo
      };
    }
    
    return null;
  },
  
  // Create or update user subscription
  updateUserSubscription: async (userId: string, planId: string) => {
    const existingSub = await subscriptionService.getUserSubscription(userId);
    
    if (existingSub) {
      const sql = `
        UPDATE user_subscriptions 
        SET plan_id = ?, updated_at = NOW() 
        WHERE user_id = ?
      `;
      await query(sql, [planId, userId]);
    } else {
      const sql = `
        INSERT INTO user_subscriptions (id, user_id, plan_id, status) 
        VALUES (?, ?, ?, ?)
      `;
      await query(sql, [crypto.randomUUID(), userId, planId, 'active']);
    }
    
    return subscriptionService.getUserSubscription(userId);
  }
};

// Export the database services
export default {
  testConnection,
  query,
  chatbotService,
  userService,
  subscriptionService
};
