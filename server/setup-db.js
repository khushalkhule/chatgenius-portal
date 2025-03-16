
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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

async function setupDatabase() {
  let connection;
  try {
    // Create a connection
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    console.log('Connected to database successfully');

    // Read SQL file
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'setup-db.sql'),
      'utf8'
    );

    // Split SQL script into statements
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement + ';');
    }

    console.log('Database tables created successfully');

    // Create a demo admin user if it doesn't exist
    const [admins] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@example.com']
    );

    if (admins.length === 0) {
      const adminId = uuidv4();
      const adminPasswordHash = await bcrypt.hash('admin123', 10);

      await connection.execute(
        'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [adminId, 'admin@example.com', 'Admin User', adminPasswordHash, 'admin']
      );

      console.log('Demo admin user created');
    }

    // Create a demo client user if it doesn't exist
    const [clients] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['demo@example.com']
    );

    if (clients.length === 0) {
      const clientId = 'user-1'; // Use fixed ID for client to match frontend storage
      const clientPasswordHash = await bcrypt.hash('demo123', 10);

      await connection.execute(
        'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [clientId, 'demo@example.com', 'Demo User', clientPasswordHash, 'client']
      );

      console.log('Demo client user created');

      // Create a subscription for the demo user if it doesn't exist
      const [subscriptions] = await connection.execute(
        'SELECT * FROM user_subscriptions WHERE user_id = ?',
        [clientId]
      );

      if (subscriptions.length === 0) {
        await connection.execute(
          'INSERT INTO user_subscriptions (id, user_id, plan_id, status) VALUES (?, ?, ?, ?)',
          [uuidv4(), clientId, '1', 'active']
        );

        console.log('Demo user subscription created');
      }

      // Create a sample chatbot for the demo user if none exists
      const [chatbots] = await connection.execute(
        'SELECT * FROM chatbots WHERE user_id = ?',
        [clientId]
      );

      if (chatbots.length === 0) {
        const sampleConfig = {
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
        };

        const chatbotId = 'chatbot-1';
        
        await connection.execute(
          'INSERT INTO chatbots (id, user_id, name, description, status, configuration) VALUES (?, ?, ?, ?, ?, ?)',
          [
            chatbotId,
            clientId,
            'Sample Chatbot',
            'A sample chatbot for demonstration',
            'active',
            JSON.stringify(sampleConfig)
          ]
        );

        console.log('Sample chatbot created for demo user');
        
        // Create sample conversation data
        const conversationId = uuidv4();
        await connection.execute(
          'INSERT INTO conversations (id, chatbot_id, user_identifier, message_count, status) VALUES (?, ?, ?, ?, ?)',
          [conversationId, chatbotId, 'anonymous-user-1', 3, 'ended']
        );
        
        // Add sample messages
        await connection.execute(
          'INSERT INTO messages (id, conversation_id, content, is_bot) VALUES (?, ?, ?, ?)',
          [uuidv4(), conversationId, 'Hi there! How can I help you today?', true]
        );
        
        await connection.execute(
          'INSERT INTO messages (id, conversation_id, content, is_bot) VALUES (?, ?, ?, ?)',
          [uuidv4(), conversationId, 'What services do you offer?', false]
        );
        
        await connection.execute(
          'INSERT INTO messages (id, conversation_id, content, is_bot) VALUES (?, ?, ?, ?)',
          [uuidv4(), conversationId, 'We offer a range of services including web design, development, and digital marketing solutions. Is there a specific service you\'re interested in?', true]
        );
        
        // Create sample lead
        await connection.execute(
          'INSERT INTO leads (id, chatbot_id, conversation_id, name, email, status) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), chatbotId, conversationId, 'John Doe', 'john.doe@example.com', 'new']
        );
        
        // Create sample analytics
        const today = new Date().toISOString().split('T')[0];
        await connection.execute(
          'INSERT INTO analytics (id, chatbot_id, date, conversations, messages, leads, avg_response_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), chatbotId, today, 1, 3, 1, 2.5]
        );
        
        console.log('Sample conversation, messages, lead, and analytics data created');
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase().catch(console.error);
