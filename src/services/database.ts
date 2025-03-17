
import mockDb from './mockDatabase';

// We're using a mock database for the browser environment
const db = {
  execute: async (sql: string, params: any[] = []): Promise<[any[], any]> => {
    try {
      // Log the query for debugging
      console.log(`Executing query: ${sql}`, params);
      
      // Use the mock database to execute the query
      const results = await mockDb.query(sql, params);
      
      // Return the results in the same format as mysql2/promise
      return [results, {}];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add other MySQL pool methods as needed
  getConnection: async () => {
    return {
      execute: async (sql: string, params: any[] = []) => {
        return db.execute(sql, params);
      },
      query: async (sql: string, params: any[] = []) => {
        return db.execute(sql, params);
      },
      beginTransaction: async () => {
        console.log('Mock transaction started');
        return Promise.resolve();
      },
      commit: async () => {
        console.log('Mock transaction committed');
        return Promise.resolve();
      },
      rollback: async () => {
        console.log('Mock transaction rolled back');
        return Promise.resolve();
      },
      release: () => {
        console.log('Mock connection released');
      }
    };
  },
  
  // Add pool end method
  end: async () => {
    console.log('Mock database connection pool closed');
    return Promise.resolve();
  }
};

export default db;
