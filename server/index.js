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

// Knowledge Base API endpoints
app.get('/api/knowledge-bases/chatbot/:chatbotId', authenticateUser, async (req, res) => {
  const { chatbotId } = req.params;
  
  try {
    // First, check if the chatbot belongs to the authenticated user
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get all knowledge bases for this chatbot
    const [knowledgeBases] = await pool.execute(
      'SELECT * FROM knowledge_bases WHERE chatbot_id = ?',
      [chatbotId]
    );
    
    // For each knowledge base, get its URLs and FAQs
    const result = [];
    
    for (const kb of knowledgeBases) {
      const [urls] = await pool.execute(
        'SELECT * FROM knowledge_base_urls WHERE knowledge_base_id = ?',
        [kb.id]
      );
      
      const [faqs] = await pool.execute(
        'SELECT * FROM knowledge_base_faqs WHERE knowledge_base_id = ?',
        [kb.id]
      );
      
      result.push({
        id: kb.id,
        chatbotId: kb.chatbot_id,
        name: kb.name,
        type: kb.type,
        status: kb.status,
        content: kb.content,
        filePath: kb.file_path,
        createdAt: kb.created_at,
        updatedAt: kb.updated_at,
        urls,
        faqs
      });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get knowledge bases error:', error);
    res.status(500).json({ success: false, message: 'Failed to get knowledge bases', error: error.message });
  }
});

app.get('/api/knowledge-bases/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get the knowledge base
    const [knowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [id]);
    
    if (knowledgeBases.length === 0) {
      return res.status(404).json({ success: false, message: 'Knowledge base not found' });
    }
    
    // Check if the chatbot belongs to the authenticated user
    const chatbotId = knowledgeBases[0].chatbot_id;
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get URLs and FAQs
    const [urls] = await pool.execute(
      'SELECT * FROM knowledge_base_urls WHERE knowledge_base_id = ?',
      [id]
    );
    
    const [faqs] = await pool.execute(
      'SELECT * FROM knowledge_base_faqs WHERE knowledge_base_id = ?',
      [id]
    );
    
    const result = {
      id: knowledgeBases[0].id,
      chatbotId: knowledgeBases[0].chatbot_id,
      name: knowledgeBases[0].name,
      type: knowledgeBases[0].type,
      status: knowledgeBases[0].status,
      content: knowledgeBases[0].content,
      filePath: knowledgeBases[0].file_path,
      createdAt: knowledgeBases[0].created_at,
      updatedAt: knowledgeBases[0].updated_at,
      urls,
      faqs
    };
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ success: false, message: 'Failed to get knowledge base', error: error.message });
  }
});

app.post('/api/knowledge-bases', authenticateUser, async (req, res) => {
  const { chatbotId, name, type, status, content, filePath, urls, faqs } = req.body;
  
  try {
    // Check if the chatbot belongs to the authenticated user
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create the knowledge base
      const id = uuidv4();
      await connection.execute(
        `INSERT INTO knowledge_bases (id, chatbot_id, name, type, status, content, file_path)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, chatbotId, name, type, status || 'active', content || null, filePath || null]
      );
      
      // Add URLs if provided
      if (type === 'website' && urls && urls.length > 0) {
        for (const url of urls) {
          const urlId = uuidv4();
          await connection.execute(
            `INSERT INTO knowledge_base_urls (id, knowledge_base_id, url, status)
             VALUES (?, ?, ?, ?)`,
            [urlId, id, url.url, 'pending']
          );
        }
      }
      
      // Add FAQs if provided
      if (type === 'faq' && faqs && faqs.length > 0) {
        for (const faq of faqs) {
          const faqId = uuidv4();
          await connection.execute(
            `INSERT INTO knowledge_base_faqs (id, knowledge_base_id, question, answer)
             VALUES (?, ?, ?, ?)`,
            [faqId, id, faq.question, faq.answer]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      // Get the created knowledge base with its URLs and FAQs
      const [knowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [id]);
      const [createdUrls] = await pool.execute('SELECT * FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
      const [createdFaqs] = await pool.execute('SELECT * FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
      
      const result = {
        id: knowledgeBases[0].id,
        chatbotId: knowledgeBases[0].chatbot_id,
        name: knowledgeBases[0].name,
        type: knowledgeBases[0].type,
        status: knowledgeBases[0].status,
        content: knowledgeBases[0].content,
        filePath: knowledgeBases[0].file_path,
        createdAt: knowledgeBases[0].created_at,
        updatedAt: knowledgeBases[0].updated_at,
        urls: createdUrls,
        faqs: createdFaqs
      };
      
      res.status(201).json({ success: true, message: 'Knowledge base created successfully', data: result });
    } catch (error) {
      // Roll back transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create knowledge base error:', error);
    res.status(500).json({ success: false, message: 'Failed to create knowledge base', error: error.message });
  }
});

app.put('/api/knowledge-bases/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { name, status, content, filePath, urls, faqs } = req.body;
  
  try {
    // Check if the knowledge base exists
    const [knowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [id]);
    
    if (knowledgeBases.length === 0) {
      return res.status(404).json({ success: false, message: 'Knowledge base not found' });
    }
    
    // Check if the chatbot belongs to the authenticated user
    const chatbotId = knowledgeBases[0].chatbot_id;
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update the knowledge base
      const updateFields = [];
      const params = [];
      
      if (name !== undefined) {
        updateFields.push('name = ?');
        params.push(name);
      }
      
      if (status !== undefined) {
        updateFields.push('status = ?');
        params.push(status);
      }
      
      if (content !== undefined) {
        updateFields.push('content = ?');
        params.push(content);
      }
      
      if (filePath !== undefined) {
        updateFields.push('file_path = ?');
        params.push(filePath);
      }
      
      updateFields.push('updated_at = NOW()');
      
      if (updateFields.length > 0) {
        const sql = `UPDATE knowledge_bases SET ${updateFields.join(', ')} WHERE id = ?`;
        params.push(id);
        await connection.execute(sql, params);
      }
      
      // Update URLs if provided
      if (urls !== undefined) {
        // Delete existing URLs
        await connection.execute('DELETE FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
        
        // Add new URLs
        if (urls.length > 0) {
          for (const url of urls) {
            const urlId = uuidv4();
            await connection.execute(
              `INSERT INTO knowledge_base_urls (id, knowledge_base_id, url, status)
               VALUES (?, ?, ?, ?)`,
              [urlId, id, url.url, url.status || 'pending']
            );
          }
        }
      }
      
      // Update FAQs if provided
      if (faqs !== undefined) {
        // Delete existing FAQs
        await connection.execute('DELETE FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
        
        // Add new FAQs
        if (faqs.length > 0) {
          for (const faq of faqs) {
            const faqId = uuidv4();
            await connection.execute(
              `INSERT INTO knowledge_base_faqs (id, knowledge_base_id, question, answer)
               VALUES (?, ?, ?, ?)`,
              [faqId, id, faq.question, faq.answer]
            );
          }
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      // Get the updated knowledge base with its URLs and FAQs
      const [updatedKnowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [id]);
      const [updatedUrls] = await pool.execute('SELECT * FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
      const [updatedFaqs] = await pool.execute('SELECT * FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
      
      const result = {
        id: updatedKnowledgeBases[0].id,
        chatbotId: updatedKnowledgeBases[0].chatbot_id,
        name: updatedKnowledgeBases[0].name,
        type: updatedKnowledgeBases[0].type,
        status: updatedKnowledgeBases[0].status,
        content: updatedKnowledgeBases[0].content,
        filePath: updatedKnowledgeBases[0].file_path,
        createdAt: updatedKnowledgeBases[0].created_at,
        updatedAt: updatedKnowledgeBases[0].updated_at,
        urls: updatedUrls,
        faqs: updatedFaqs
      };
      
      res.json({ success: true, message: 'Knowledge base updated successfully', data: result });
    } catch (error) {
      // Roll back transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update knowledge base error:', error);
    res.status(500).json({ success: false, message: 'Failed to update knowledge base', error: error.message });
  }
});

app.delete('/api/knowledge-bases/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if the knowledge base exists
    const [knowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [id]);
    
    if (knowledgeBases.length === 0) {
      return res.status(404).json({ success: false, message: 'Knowledge base not found' });
    }
    
    // Check if the chatbot belongs to the authenticated user
    const chatbotId = knowledgeBases[0].chatbot_id;
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Delete related URLs
      await connection.execute('DELETE FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
      
      // Delete related FAQs
      await connection.execute('DELETE FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
      
      // Delete the knowledge base
      await connection.execute('DELETE FROM knowledge_bases WHERE id = ?', [id]);
      
      // Commit transaction
      await connection.commit();
      
      res.json({ success: true, message: 'Knowledge base deleted successfully' });
    } catch (error) {
      // Roll back transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete knowledge base error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete knowledge base', error: error.message });
  }
});

// URL management endpoints
app.put('/api/knowledge-base-urls/:id/status', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { status, errorMessage } = req.body;
  
  if (!['pending', 'crawled', 'error'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  
  try {
    // Get the URL to check ownership
    const [urls] = await pool.execute('SELECT * FROM knowledge_base_urls WHERE id = ?', [id]);
    
    if (urls.length === 0) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    
    // Get the knowledge base
    const knowledgeBaseId = urls[0].knowledge_base_id;
    const [knowledgeBases] = await pool.execute('SELECT * FROM knowledge_bases WHERE id = ?', [knowledgeBaseId]);
    
    if (knowledgeBases.length === 0) {
      return res.status(404).json({ success: false, message: 'Knowledge base not found' });
    }
    
    // Check chatbot ownership
    const chatbotId = knowledgeBases[0].chatbot_id;
    const [chatbots] = await pool.execute('SELECT user_id FROM chatbots WHERE id = ?', [chatbotId]);
    
    if (chatbots.length === 0) {
      return res.status(404).json({ success: false, message: 'Chatbot not found' });
    }
    
    if (req.userId && req.userId !== chatbots[0].user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Update URL status
    let sql = 'UPDATE knowledge_base_urls SET status = ?';
    const params = [status];
    
    if (status === 'crawled') {
      sql += ', last_crawled = NOW()';
    }
    
    if (status === 'error' && errorMessage) {
      sql += ', error_message = ?';
      params.push(errorMessage);
    }
    
    sql += ', updated_at = NOW() WHERE id = ?';
    params.push(id);
    
    await pool.execute(sql, params);
    
    res.json({ success: true, message: 'URL status updated successfully' });
  } catch (error) {
    console.error('Update URL status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update URL status', error: error.message });
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
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }
    
    // Format the plan
    const plan = {
      ...plans[0],
      price_value: Number(plans[0].price_value),
      price_monthly_value: plans[0].price_monthly_value ? Number(plans[0].price_monthly_value) : undefined,
      chatbots: Number(plans[0].chatbots),
      api_calls: Number(plans[0].api_calls),
      storage: Number(plans[0].storage),
      features: plans[0].features ? JSON.parse(plans[0].features) : []
    };
    
    res.json({ success: true, plan });
  } catch (error) {
    console.error('Get subscription plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to get subscription plan', error: error.message });
  }
});

// Generic 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

