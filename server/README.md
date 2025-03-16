
# ChatSaaS Server

Backend server for ChatSaaS application built with Node.js, Express, and MySQL.

## Database Setup

This application uses MySQL as the database. The database connection is configured in `index.js`.

## Getting Started

1. Make sure you have Node.js installed on your machine.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies and set up the database:
   ```bash
   npm install
   npm run setup
   ```
   This will install all required dependencies and create the necessary tables and seed data.

4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on port 5000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Users

- `GET /api/users/:id` - Get a user by ID

### Chatbots

- `GET /api/chatbots/:userId` - Get all chatbots for a user
- `GET /api/chatbots/single/:id` - Get a chatbot by ID
- `POST /api/chatbots` - Create a new chatbot
- `PUT /api/chatbots/:id` - Update a chatbot
- `DELETE /api/chatbots/:id` - Delete a chatbot

### Knowledge Bases

- `GET /api/knowledge-bases/:chatbotId` - Get all knowledge bases for a chatbot
- `GET /api/knowledge-bases/single/:id` - Get a knowledge base by ID
- `POST /api/knowledge-bases` - Create a new knowledge base
- `PUT /api/knowledge-bases/:id` - Update a knowledge base
- `DELETE /api/knowledge-bases/:id` - Delete a knowledge base

### Subscription Plans

- `GET /api/subscription-plans` - Get all subscription plans
- `GET /api/subscription-plans/:id` - Get a subscription plan by ID

### User Subscriptions

- `GET /api/user-subscription/:userId` - Get a user's subscription
- `PUT /api/user-subscription/:userId` - Update a user's subscription

### Conversations

- `GET /api/conversations/:chatbotId` - Get all conversations for a chatbot
- `GET /api/conversations/single/:id` - Get a conversation with messages
- `POST /api/conversations` - Create a new conversation
- `PUT /api/conversations/:id/end` - End a conversation

### Leads

- `GET /api/leads/:userId` - Get all leads for a user
- `GET /api/leads/chatbot/:chatbotId` - Get leads for a specific chatbot
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id/status` - Update lead status

## Authentication

Most endpoints require authentication. To authenticate a request, include an `Authorization` header with a Bearer token:

```
Authorization: Bearer <token>
```

When a user registers or logs in, the API will return a token that should be used for subsequent requests.

## Development

During development, you can skip authentication by including the header:

```
x-skip-auth: development
```

This should only be used for development and testing purposes.

## Database Schema

The database schema includes the following tables:

### Core Tables
- `users` - User accounts
- `auth_tokens` - Authentication tokens
- `chatbots` - Chatbot configurations
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User's subscriptions

### Knowledge Base Tables
- `knowledge_bases` - Knowledge base information
- `knowledge_base_urls` - URLs associated with a knowledge base
- `knowledge_base_faqs` - FAQ pairs for a knowledge base
- `files` - Uploaded files information

### Conversation and Lead Tables
- `conversations` - Chat conversations
- `messages` - Individual messages in conversations
- `leads` - Lead information collected through chatbots

### Analytics and System Tables
- `analytics` - Usage analytics
- `api_usage` - API endpoint usage tracking
- `webhooks` - Webhook configurations
- `integrations` - Third-party integrations
- `invoices` - Billing information
- `theme_templates` - UI theme templates

For detailed schema information, see the `setup-db.sql` file.
