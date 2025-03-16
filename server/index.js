
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
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

// Auth middleware
const authenticateUser = async (req, res, next) => {
  // For development, we'll skip authentication if you set this header
  if (req.headers['x-skip-auth'] === 'development') {
    return next();
  }
  
  // Get auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // In a real app, you'd verify the token
  // For now, we'll just check if it exists in our database
  try {
    const [tokens] = await pool.execute('SELECT * FROM auth_tokens WHERE token = ?', [token]);
    
    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add user ID to request for later use
    req.userId = tokens[0].user_id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

// User API endpoints
app.post('/api/users/register', async (req, res) => {
  const { id, email, name, passwordHash, role } = req.body;
  
  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const userId = id || uuidv4();
    
    // Insert the new user
    const sql = `
      INSERT INTO users (id, email, name, password_hash, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await pool.execute(sql, [userId, email, name, hashedPassword, role || 'client']);
    
    // Create auth token
    const token = uuidv4();
    await pool.execute(
      'INSERT INTO auth_tokens (token, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [token, userId]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: { id: userId, email, name, role: role || 'client' },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Get user by email
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate and store token
    const token = uuidv4();
    await pool.execute(
      'INSERT INTO auth_tokens (token, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [token, user.id]
    );
    
    // Return user data (excluding password)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.get('/api/users/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [users] = await pool.execute('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user', error: error.message });
  }
});

// Chatbot API endpoints
app.get('/api/chatbots/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;
  
  // Check if requested user ID matches authenticated user ID
  if (req.userId && req.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  try {
    const [chatbots] = await pool.execute('SELECT * FROM chatbots WHERE user_id = ?', [userId]);
    res.json({ success: true, chatbots });
  } catch (error) {
    console.error('Get chatbots error:', error);
    res.status(500).json({ success: false, message: 'Failed to get chatbots', error: error.message });
  }
});

app.get('/api/chatbots/single/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [chatbots] = await pool.execute('SELECT * FROM chatbots WHERE id = ?', [id]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    // Check if authenticated user owns this chatbot
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, chatbot: chatbots[0] });
  } catch (error) {
    console.error('Get chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to get chatbot', error: error.message });
  }
});

app.post('/api/chatbots', authenticateUser, async (req, res) => {
  const { id, userId, name, description, status, configuration } = req.body;
  
  // Check if authenticated user matches the user ID in the request
  if (req.userId && req.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  try {
    const chatbotId = id || uuidv4();
    const configString = typeof configuration === 'string' 
      ? configuration 
      : JSON.stringify(configuration || {});
    
    const sql = `
      INSERT INTO chatbots (id, user_id, name, description, status, configuration) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await pool.execute(sql, [
      chatbotId, 
      userId, 
      name, 
      description || '', 
      status || 'active', 
      configString
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Chatbot created successfully',
      chatbot: { 
        id: chatbotId, 
        user_id: userId, 
        name, 
        description: description || '', 
        status: status || 'active',
        configuration: configString
      }
    });
  } catch (error) {
    console.error('Create chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to create chatbot', error: error.message });
  }
});

app.put('/api/chatbots/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    // Check if chatbot exists and belongs to authenticated user
    const [chatbots] = await pool.execute('SELECT * FROM chatbots WHERE id = ?', [id]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Build the SQL update statement
    let sql = 'UPDATE chatbots SET ';
    const params = [];
    const updateFields = [];
    
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
      params.push(typeof updates.configuration === 'string'
        ? updates.configuration
        : JSON.stringify(updates.configuration));
    }
    
    updateFields.push('updated_at = NOW()');
    
    sql += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await pool.execute(sql, params);
    
    // Get the updated chatbot
    const [updatedChatbots] = await pool.execute('SELECT * FROM chatbots WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Chatbot updated successfully',
      chatbot: updatedChatbots[0]
    });
  } catch (error) {
    console.error('Update chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to update chatbot', error: error.message });
  }
});

app.delete('/api/chatbots/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if chatbot exists and belongs to authenticated user
    const [chatbots] = await pool.execute('SELECT * FROM chatbots WHERE id = ?', [id]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await pool.execute('DELETE FROM chatbots WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Chatbot deleted successfully'
    });
  } catch (error) {
    console.error('Delete chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete chatbot', error: error.message });
  }
});

// Subscription plan endpoints
app.get('/api/subscription-plans', async (req, res) => {
  try {
    const [plans] = await pool.execute('SELECT * FROM subscription_plans ORDER BY price_value ASC');
    
    // Format the plans
    const formattedPlans = plans.map(plan => ({
      ...plan,
      price_value: Number(plan.price_value),
      price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
      chatbots: Number(plan.chatbots),
      api_calls: Number(plan.api_calls),
      storage: Number(plan.storage),
      features: plan.features ? JSON.parse(plan.features) : []
    }));
    
    res.json({ success: true, plans: formattedPlans });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ success: false, message: 'Failed to get subscription plans', error: error.message });
  }
});

app.get('/api/subscription-plans/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [plans] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [id]);
    
    if (plans.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    const plan = plans[0];
    const formattedPlan = {
      ...plan,
      price_value: Number(plan.price_value),
      price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
      chatbots: Number(plan.chatbots),
      api_calls: Number(plan.api_calls),
      storage: Number(plan.storage),
      features: plan.features ? JSON.parse(plan.features) : []
    };
    
    res.json({ success: true, plan: formattedPlan });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to get plan', error: error.message });
  }
});

app.get('/api/user-subscription/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;
  
  // Check if authenticated user matches the requested user
  if (req.userId && req.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  try {
    const [subscriptions] = await pool.execute('SELECT * FROM user_subscriptions WHERE user_id = ?', [userId]);
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    
    const subscription = subscriptions[0];
    
    // Get the plan details
    const [plans] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [subscription.plan_id]);
    
    if (plans.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    const plan = plans[0];
    const formattedPlan = {
      ...plan,
      price_value: Number(plan.price_value),
      price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
      chatbots: Number(plan.chatbots),
      api_calls: Number(plan.api_calls),
      storage: Number(plan.storage),
      features: plan.features ? JSON.parse(plan.features) : []
    };
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        status: subscription.status,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at,
        planInfo: formattedPlan
      }
    });
  } catch (error) {
    console.error('Get user subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user subscription', error: error.message });
  }
});

app.put('/api/user-subscription/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;
  const { planId } = req.body;
  
  // Check if authenticated user matches the requested user
  if (req.userId && req.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  try {
    // Check if plan exists
    const [plans] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    // Check if user subscription exists
    const [subscriptions] = await pool.execute('SELECT * FROM user_subscriptions WHERE user_id = ?', [userId]);
    
    if (subscriptions.length === 0) {
      // Create new subscription
      const subscriptionId = uuidv4();
      await pool.execute(
        'INSERT INTO user_subscriptions (id, user_id, plan_id, status) VALUES (?, ?, ?, ?)',
        [subscriptionId, userId, planId, 'active']
      );
    } else {
      // Update existing subscription
      await pool.execute(
        'UPDATE user_subscriptions SET plan_id = ?, updated_at = NOW() WHERE user_id = ?',
        [planId, userId]
      );
    }
    
    // Get the updated subscription
    const [updatedSubscriptions] = await pool.execute('SELECT * FROM user_subscriptions WHERE user_id = ?', [userId]);
    const subscription = updatedSubscriptions[0];
    
    // Get the plan details
    const [planDetails] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    const plan = planDetails[0];
    
    const formattedPlan = {
      ...plan,
      price_value: Number(plan.price_value),
      price_monthly_value: plan.price_monthly_value ? Number(plan.price_monthly_value) : undefined,
      chatbots: Number(plan.chatbots),
      api_calls: Number(plan.api_calls),
      storage: Number(plan.storage),
      features: plan.features ? JSON.parse(plan.features) : []
    };
    
    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        status: subscription.status,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at,
        planInfo: formattedPlan
      }
    });
  } catch (error) {
    console.error('Update user subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user subscription', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
