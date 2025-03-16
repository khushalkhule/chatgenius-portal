
# ChatSaaS Server

Backend server for ChatSaaS application built with Node.js, Express, and MySQL.

## Database Setup

This application uses MySQL as the database. The database connection is configured in `index.js`.

## Getting Started

1. Make sure you have Node.js installed on your machine.
2. Set up your MySQL database and configure the connection in `index.js`.
3. Run the database setup script to create the necessary tables and seed data:

```bash
npm run setup
```

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

### Subscription Plans

- `GET /api/subscription-plans` - Get all subscription plans
- `GET /api/subscription-plans/:id` - Get a subscription plan by ID

### User Subscriptions

- `GET /api/user-subscription/:userId` - Get a user's subscription
- `PUT /api/user-subscription/:userId` - Update a user's subscription

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

- `users` - User accounts
- `auth_tokens` - Authentication tokens
- `chatbots` - Chatbot configurations
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User's subscriptions

For detailed schema information, see the `setup-db.sql` file.
