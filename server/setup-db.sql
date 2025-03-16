
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authentication tokens table
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  user_id VARCHAR(36) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive', 'draft') NOT NULL DEFAULT 'active',
  configuration JSON,
  conversation_count INT DEFAULT 0,
  lead_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  price_value DECIMAL(10, 2) NOT NULL,
  period ENUM('month', 'year') NOT NULL DEFAULT 'month',
  price_monthly VARCHAR(50),
  price_monthly_value DECIMAL(10, 2),
  chatbots INT NOT NULL DEFAULT 1,
  api_calls INT NOT NULL DEFAULT 100,
  storage INT NOT NULL DEFAULT 1,
  description TEXT,
  features JSON,
  highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  plan_id VARCHAR(36) NOT NULL,
  status ENUM('active', 'canceled', 'expired') NOT NULL DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Conversations table (New)
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  user_identifier VARCHAR(255),
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  message_count INT DEFAULT 0,
  status ENUM('active', 'ended', 'abandoned') DEFAULT 'active',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Messages table (New)
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  is_bot BOOLEAN NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Leads table (New)
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  conversation_id VARCHAR(36),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  status ENUM('new', 'contacted', 'qualified', 'converted', 'disqualified') DEFAULT 'new',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
);

-- Analytics table (New)
CREATE TABLE IF NOT EXISTS analytics (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  conversations INT DEFAULT 0,
  messages INT DEFAULT 0,
  leads INT DEFAULT 0,
  avg_response_time FLOAT,
  avg_conversation_length FLOAT,
  success_rate FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
  UNIQUE KEY unique_chatbot_day (chatbot_id, date)
);

-- Invoices table (New)
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  subscription_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  billing_date DATE NOT NULL,
  payment_date DATE,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE
);

-- Integrations table (New)
CREATE TABLE IF NOT EXISTS integrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('hubspot', 'zapier', 'instagram', 'slack', 'other') NOT NULL,
  name VARCHAR(255) NOT NULL,
  configuration JSON,
  status ENUM('active', 'inactive', 'failed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default subscription plans if they don't exist
INSERT INTO subscription_plans (id, name, price, price_value, period, chatbots, api_calls, storage, description, features, highlighted, badge)
SELECT '1', 'Free', '$0', 0, 'month', 1, 100, 1, 'Basic plan for individuals', JSON_ARRAY('1 chatbot', '100 API calls/month', '1GB storage'), FALSE, ''
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = '1');

INSERT INTO subscription_plans (id, name, price, price_value, period, price_monthly, price_monthly_value, chatbots, api_calls, storage, description, features, highlighted, badge)
SELECT '2', 'Pro', '$29', 29, 'month', '$29', 29, 5, 1000, 10, 'Perfect for small businesses', JSON_ARRAY('5 chatbots', '1,000 API calls/month', '10GB storage', 'Priority support'), TRUE, 'Most Popular'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = '2');

INSERT INTO subscription_plans (id, name, price, price_value, period, price_monthly, price_monthly_value, chatbots, api_calls, storage, description, features, highlighted, badge)
SELECT '3', 'Enterprise', '$99', 99, 'month', '$99', 99, 20, 5000, 50, 'For larger organizations', JSON_ARRAY('20 chatbots', '5,000 API calls/month', '50GB storage', 'Dedicated support', 'Custom integrations'), FALSE, 'Enterprise'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = '3');
