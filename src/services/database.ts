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

// Conversation specific database functions
export const conversationService = {
  // Get all conversations for a chatbot
  getConversationsByChatbotId: async (chatbotId: string) => {
    try {
      const sql = `
        SELECT c.*, 
               COUNT(m.id) as message_count, 
               MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.chatbot_id = ?
        GROUP BY c.id
        ORDER BY c.start_time DESC
      `;
      const results = await query(sql, [chatbotId]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getConversationsByChatbotId:', error);
      return [];
    }
  },
  
  // Get a single conversation with its messages
  getConversationWithMessages: async (conversationId: string) => {
    try {
      // Get the conversation
      const conversationSql = 'SELECT * FROM conversations WHERE id = ?';
      const conversationResults = await query(conversationSql, [conversationId]);
      
      if (!isRowDataPacketArray(conversationResults) || conversationResults.length === 0) {
        return null;
      }
      
      const conversation = conversationResults[0];
      
      // Get the messages for this conversation
      const messagesSql = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC';
      const messagesResults = await query(messagesSql, [conversationId]);
      
      const messages = isRowDataPacketArray(messagesResults) ? messagesResults : [];
      
      return {
        ...conversation,
        messages
      };
    } catch (error) {
      console.error('Error in getConversationWithMessages:', error);
      return null;
    }
  },
  
  // Create a new conversation
  createConversation: async (conversation: any) => {
    const sql = `
      INSERT INTO conversations (id, chatbot_id, user_identifier, status) 
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      conversation.id,
      conversation.chatbotId,
      conversation.userIdentifier || 'anonymous',
      conversation.status || 'active'
    ];
    
    await query(sql, params);
    return conversation;
  },
  
  // Add a message to a conversation
  addMessage: async (message: any) => {
    const sql = `
      INSERT INTO messages (id, conversation_id, content, is_bot) 
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      message.id,
      message.conversationId,
      message.content,
      message.isBot ? 1 : 0
    ];
    
    await query(sql, params);
    
    // Update the message count in the conversation
    await query(
      'UPDATE conversations SET message_count = message_count + 1 WHERE id = ?',
      [message.conversationId]
    );
    
    return message;
  },
  
  // End a conversation
  endConversation: async (conversationId: string) => {
    const sql = `
      UPDATE conversations 
      SET status = 'ended', end_time = NOW() 
      WHERE id = ?
    `;
    
    return query(sql, [conversationId]);
  }
};

// Lead specific database functions
export const leadService = {
  // Get all leads for a user
  getLeadsByUserId: async (userId: string) => {
    try {
      const sql = `
        SELECT l.*, c.name as chatbot_name
        FROM leads l
        JOIN chatbots c ON l.chatbot_id = c.id
        WHERE c.user_id = ?
        ORDER BY l.created_at DESC
      `;
      const results = await query(sql, [userId]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getLeadsByUserId:', error);
      return [];
    }
  },
  
  // Get leads for a specific chatbot
  getLeadsByChatbotId: async (chatbotId: string) => {
    try {
      const sql = 'SELECT * FROM leads WHERE chatbot_id = ? ORDER BY created_at DESC';
      const results = await query(sql, [chatbotId]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getLeadsByChatbotId:', error);
      return [];
    }
  },
  
  // Create a new lead
  createLead: async (lead: any) => {
    const sql = `
      INSERT INTO leads (id, chatbot_id, conversation_id, name, email, phone, company, status, metadata) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      lead.id,
      lead.chatbotId,
      lead.conversationId || null,
      lead.name || null,
      lead.email || null,
      lead.phone || null,
      lead.company || null,
      lead.status || 'new',
      lead.metadata ? JSON.stringify(lead.metadata) : null
    ];
    
    await query(sql, params);
    
    // Update the lead count in the chatbot
    await query(
      'UPDATE chatbots SET lead_count = lead_count + 1 WHERE id = ?',
      [lead.chatbotId]
    );
    
    return lead;
  },
  
  // Update lead status
  updateLeadStatus: async (leadId: string, status: string) => {
    const sql = 'UPDATE leads SET status = ?, updated_at = NOW() WHERE id = ?';
    return query(sql, [status, leadId]);
  }
};

// Analytics specific database functions
export const analyticsService = {
  // Get analytics for a user's chatbots
  getAnalyticsByUserId: async (userId: string, startDate: string, endDate: string) => {
    try {
      const sql = `
        SELECT a.*, c.name as chatbot_name
        FROM analytics a
        JOIN chatbots c ON a.chatbot_id = c.id
        WHERE c.user_id = ? AND a.date BETWEEN ? AND ?
        ORDER BY a.date ASC
      `;
      const results = await query(sql, [userId, startDate, endDate]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getAnalyticsByUserId:', error);
      return [];
    }
  },
  
  // Get analytics for a specific chatbot
  getAnalyticsByChatbotId: async (chatbotId: string, startDate: string, endDate: string) => {
    try {
      const sql = `
        SELECT * FROM analytics 
        WHERE chatbot_id = ? AND date BETWEEN ? AND ?
        ORDER BY date ASC
      `;
      const results = await query(sql, [chatbotId, startDate, endDate]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getAnalyticsByChatbotId:', error);
      return [];
    }
  },
  
  // Record analytics for a day
  recordDailyAnalytics: async (analytics: any) => {
    // First check if there's an existing record for this chatbot and date
    const checkSql = 'SELECT id FROM analytics WHERE chatbot_id = ? AND date = ?';
    const checkResults = await query(checkSql, [analytics.chatbotId, analytics.date]);
    
    if (isRowDataPacketArray(checkResults) && checkResults.length > 0) {
      // Update existing record
      const updateSql = `
        UPDATE analytics 
        SET conversations = ?, messages = ?, leads = ?, avg_response_time = ?, 
            avg_conversation_length = ?, success_rate = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      await query(updateSql, [
        analytics.conversations,
        analytics.messages,
        analytics.leads,
        analytics.avgResponseTime,
        analytics.avgConversationLength,
        analytics.successRate,
        checkResults[0].id
      ]);
      
      return { ...analytics, id: checkResults[0].id };
    } else {
      // Insert new record
      const insertSql = `
        INSERT INTO analytics (id, chatbot_id, date, conversations, messages, leads, 
                               avg_response_time, avg_conversation_length, success_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const analyticsId = analytics.id || crypto.randomUUID();
      
      await query(insertSql, [
        analyticsId,
        analytics.chatbotId,
        analytics.date,
        analytics.conversations || 0,
        analytics.messages || 0,
        analytics.leads || 0,
        analytics.avgResponseTime || 0,
        analytics.avgConversationLength || 0,
        analytics.successRate || 0
      ]);
      
      return { ...analytics, id: analyticsId };
    }
  }
};

// Integration specific database functions
export const integrationService = {
  // Get all integrations for a user
  getIntegrationsByUserId: async (userId: string) => {
    try {
      const sql = 'SELECT * FROM integrations WHERE user_id = ?';
      const results = await query(sql, [userId]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getIntegrationsByUserId:', error);
      return [];
    }
  },
  
  // Create a new integration
  createIntegration: async (integration: any) => {
    const sql = `
      INSERT INTO integrations (id, user_id, type, name, configuration, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      integration.id || crypto.randomUUID(),
      integration.userId,
      integration.type,
      integration.name,
      integration.configuration ? JSON.stringify(integration.configuration) : null,
      integration.status || 'active'
    ];
    
    await query(sql, params);
    return integration;
  },
  
  // Update an integration
  updateIntegration: async (id: string, updates: any) => {
    let sql = 'UPDATE integrations SET ';
    const params = [];
    const updateFields = [];
    
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.configuration !== undefined) {
      updateFields.push('configuration = ?');
      params.push(JSON.stringify(updates.configuration));
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      params.push(updates.status);
    }
    
    updateFields.push('updated_at = NOW()');
    
    sql += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await query(sql, params);
    return { id, ...updates };
  },
  
  // Delete an integration
  deleteIntegration: async (id: string) => {
    const sql = 'DELETE FROM integrations WHERE id = ?';
    return query(sql, [id]);
  }
};

// Invoice specific database functions
export const invoiceService = {
  // Get all invoices for a user
  getInvoicesByUserId: async (userId: string) => {
    try {
      const sql = 'SELECT * FROM invoices WHERE user_id = ? ORDER BY billing_date DESC';
      const results = await query(sql, [userId]);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Error in getInvoicesByUserId:', error);
      return [];
    }
  }
};

// Export the database services
export default {
  testConnection,
  query,
  chatbotService,
  userService,
  subscriptionService,
  conversationService,
  leadService,
  analyticsService,
  integrationService,
  invoiceService
};
