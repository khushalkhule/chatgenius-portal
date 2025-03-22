// Mock database service that uses localStorage instead of MySQL
import { v4 as uuidv4 } from 'uuid';

// Define the collections we'll use in localStorage
const collections = [
  'mockChatbots',
  'mockKnowledgeBases',
  'mockKnowledgeBaseUrls',
  'mockKnowledgeBaseFaqs',
  'mockUsers',
  'mockAuthTokens',
  'mockSubscriptionPlans'
];

// Initialize localStorage collections if they don't exist
const initializeCollections = () => {
  collections.forEach(collection => {
    if (!localStorage.getItem(collection)) {
      localStorage.setItem(collection, JSON.stringify([]));
    }
  });
  
  // Add some initial data for users if none exists
  const users = getCollection('mockUsers');
  if (users.length === 0) {
    const initialUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        subscription_plan: 'Pro',
        status: 'active',
        last_login_at: '2023-06-20T14:30:00.000Z',
        created_at: '2023-01-15T09:30:00.000Z',
        chatbot_count: 5,
        avatar_url: '',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        subscription_plan: 'Basic',
        status: 'active',
        last_login_at: '2023-06-19T10:15:00.000Z',
        created_at: '2023-02-05T11:45:00.000Z',
        chatbot_count: 2,
        avatar_url: '',
      },
      {
        id: '3',
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        subscription_plan: 'Enterprise',
        status: 'inactive',
        last_login_at: '2023-05-25T09:45:00.000Z',
        created_at: '2023-01-30T14:20:00.000Z',
        chatbot_count: 12,
        avatar_url: '',
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        subscription_plan: 'Pro',
        status: 'active',
        last_login_at: '2023-06-18T16:20:00.000Z',
        created_at: '2023-03-10T08:15:00.000Z',
        chatbot_count: 4,
        avatar_url: '',
      },
      {
        id: '5',
        name: 'Michael Wilson',
        email: 'michael.wilson@example.com',
        subscription_plan: 'Basic',
        status: 'suspended',
        last_login_at: '2023-06-10T11:05:00.000Z',
        created_at: '2023-02-20T13:30:00.000Z',
        chatbot_count: 1,
        avatar_url: '',
      },
    ];
    saveCollection('mockUsers', initialUsers);
  }
};

// Call this when the module is loaded
initializeCollections();

// Helper function to get a collection from localStorage
const getCollection = (name: string): any[] => {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : [];
};

// Helper function to save a collection to localStorage
const saveCollection = (name: string, data: any[]): void => {
  localStorage.setItem(name, JSON.stringify(data));
};

// Parse SQL query to extract table name (simple version)
const extractTableName = (sql: string): string | null => {
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (tableMatch && tableMatch[1]) {
    return tableMatch[1];
  }
  
  const insertMatch = sql.match(/INTO\s+(\w+)/i);
  if (insertMatch && insertMatch[1]) {
    return insertMatch[1];
  }
  
  const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (updateMatch && updateMatch[1]) {
    return updateMatch[1];
  }
  
  const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (deleteMatch && deleteMatch[1]) {
    return deleteMatch[1];
  }
  
  return null;
};

// Convert MySQL table name to localStorage collection name
const tableToCollection = (tableName: string): string => {
  switch (tableName) {
    case 'chatbots': return 'mockChatbots';
    case 'knowledge_bases': return 'mockKnowledgeBases';
    case 'knowledge_base_urls': return 'mockKnowledgeBaseUrls';
    case 'knowledge_base_faqs': return 'mockKnowledgeBaseFaqs';
    case 'users': return 'mockUsers';
    case 'auth_tokens': return 'mockAuthTokens';
    case 'subscription_plans': return 'mockSubscriptionPlans';
    default: return `mock${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`;
  }
};

const mockDb = {
  query: async (sql: string, params: any[] = []): Promise<any[]> => {
    console.log('Mock DB Query:', sql, params);
    
    // Simple query routing based on operation type and table
    if (sql.toUpperCase().startsWith('SELECT')) {
      return mockQueries.handleSelect(sql, params);
    } else if (sql.toUpperCase().startsWith('INSERT')) {
      return mockQueries.handleInsert(sql, params);
    } else if (sql.toUpperCase().startsWith('UPDATE')) {
      return mockQueries.handleUpdate(sql, params);
    } else if (sql.toUpperCase().startsWith('DELETE')) {
      return mockQueries.handleDelete(sql, params);
    }
    
    console.warn('Unhandled query:', sql);
    return [];
  }
};

const mockQueries = {
  handleSelect: (sql: string, params: any[]): any[] => {
    const tableName = extractTableName(sql);
    if (!tableName) {
      console.warn('Could not extract table name from SELECT query:', sql);
      return [];
    }
    
    const collectionName = tableToCollection(tableName);
    const collection = getCollection(collectionName);
    
    // Check for WHERE clause to filter results
    const whereMatch = sql.match(/WHERE\s+(.*?)(\s+ORDER BY|\s+LIMIT|\s+GROUP BY|$)/i);
    if (whereMatch && whereMatch[1]) {
      // Very simple WHERE parsing - assumes format "column = ?"
      const whereClause = whereMatch[1].trim();
      
      // Handle different WHERE formats
      if (whereClause.includes('=')) {
        const columnMatch = whereClause.match(/(\w+)\s*=\s*\?/);
        if (columnMatch && columnMatch[1]) {
          const column = columnMatch[1];
          const value = params[0];
          
          // Return filtered results
          return collection.filter(item => {
            // Check for snake_case to camelCase conversion
            const itemValue = item[column] || item[column.replace(/_([a-z])/g, (g) => g[1].toUpperCase())];
            return itemValue === value;
          });
        }
      }
    }
    
    // If no WHERE clause or can't parse it, return all items
    return collection;
  },
  
  handleInsert: (sql: string, params: any[]): any[] => {
    const tableName = extractTableName(sql);
    if (!tableName) {
      console.warn('Could not extract table name from INSERT query:', sql);
      return [];
    }
    
    const collectionName = tableToCollection(tableName);
    const collection = getCollection(collectionName);
    
    // Extract column names from INSERT INTO statement
    const columnsMatch = sql.match(/\(([^)]+)\)/);
    if (!columnsMatch || !columnsMatch[1]) {
      console.warn('Could not extract columns from INSERT query:', sql);
      return [];
    }
    
    // Parse column names
    const columns = columnsMatch[1].split(',').map(col => col.trim());
    
    // Create a new object with the provided values
    const newItem: any = {};
    columns.forEach((column, index) => {
      // If ID is not provided, generate a UUID
      if (column === 'id' && (!params[index] || params[index] === '')) {
        newItem[column] = uuidv4();
      } else {
        newItem[column] = params[index];
      }
    });
    
    // Add timestamps if they're in the columns but not in the params
    if (columns.includes('created_at') && !newItem['created_at']) {
      newItem['created_at'] = new Date().toISOString();
    }
    if (columns.includes('updated_at') && !newItem['updated_at']) {
      newItem['updated_at'] = new Date().toISOString();
    }
    
    // Add the new item to the collection
    collection.push(newItem);
    saveCollection(collectionName, collection);
    
    return [{ insertId: newItem.id || newItem.ID || uuidv4() }];
  },
  
  handleUpdate: (sql: string, params: any[]): any[] => {
    const tableName = extractTableName(sql);
    if (!tableName) {
      console.warn('Could not extract table name from UPDATE query:', sql);
      return [];
    }
    
    const collectionName = tableToCollection(tableName);
    const collection = getCollection(collectionName);
    
    // Extract SET clause
    const setMatch = sql.match(/SET\s+(.*?)(\s+WHERE|$)/i);
    if (!setMatch || !setMatch[1]) {
      console.warn('Could not extract SET clause from UPDATE query:', sql);
      return [];
    }
    
    // Parse SET clause - this assumes format "column1 = ?, column2 = ?, ..."
    const setParts = setMatch[1].split(',').map(part => part.trim());
    const setColumns = setParts.map(part => {
      const matches = part.match(/(\w+)\s*=\s*\?/);
      return matches && matches[1] ? matches[1] : null;
    }).filter(Boolean) as string[];
    
    // Extract WHERE clause for filtering
    const whereMatch = sql.match(/WHERE\s+(.*?)$/i);
    if (!whereMatch || !whereMatch[1]) {
      console.warn('Could not extract WHERE clause from UPDATE query:', sql);
      return [];
    }
    
    // Simple WHERE parsing - assumes "id = ?" format
    const whereClause = whereMatch[1].trim();
    const columnMatch = whereClause.match(/(\w+)\s*=\s*\?/);
    if (!columnMatch || !columnMatch[1]) {
      console.warn('Could not parse WHERE clause from UPDATE query:', sql);
      return [];
    }
    
    const whereColumn = columnMatch[1];
    const whereValue = params[params.length - 1]; // Last param is usually the WHERE value
    
    // Update the collection
    const updatedCollection = collection.map(item => {
      if (item[whereColumn] === whereValue) {
        // Apply updates
        const updatedItem = { ...item };
        setColumns.forEach((column, index) => {
          updatedItem[column] = params[index];
        });
        
        // Update timestamp if it exists
        if ('updated_at' in item) {
          updatedItem.updated_at = new Date().toISOString();
        }
        
        return updatedItem;
      }
      return item;
    });
    
    saveCollection(collectionName, updatedCollection);
    
    // Return affected rows count (MySQL-like)
    const affectedRows = updatedCollection.filter(item => item[whereColumn] === whereValue).length;
    return [{ affectedRows }];
  },
  
  handleDelete: (sql: string, params: any[]): any[] => {
    const tableName = extractTableName(sql);
    if (!tableName) {
      console.warn('Could not extract table name from DELETE query:', sql);
      return [];
    }
    
    const collectionName = tableToCollection(tableName);
    let collection = getCollection(collectionName);
    
    // Extract WHERE clause for filtering
    const whereMatch = sql.match(/WHERE\s+(.*?)$/i);
    if (!whereMatch || !whereMatch[1]) {
      console.warn('No WHERE clause in DELETE query:', sql);
      // Return without deleting anything (safety measure)
      return [];
    }
    
    // Simple WHERE parsing - assumes "column = ?" format
    const whereClause = whereMatch[1].trim();
    const columnMatch = whereClause.match(/(\w+)\s*=\s*\?/);
    if (!columnMatch || !columnMatch[1]) {
      console.warn('Could not parse WHERE clause from DELETE query:', sql);
      return [];
    }
    
    const whereColumn = columnMatch[1];
    const whereValue = params[0];
    
    // Count items to be deleted
    const beforeCount = collection.length;
    
    // Filter out the items to delete
    const filteredCollection = collection.filter(item => item[whereColumn] !== whereValue);
    
    // Calculate affected rows
    const affectedRows = beforeCount - filteredCollection.length;
    
    // Save the updated collection
    saveCollection(collectionName, filteredCollection);
    
    return [{ affectedRows }];
  }
};

export default mockDb;
