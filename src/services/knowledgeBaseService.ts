
import { v4 as uuidv4 } from 'uuid';
import db from './database';

interface KnowledgeBase {
  id: string;
  chatbotId: string;
  name: string;
  type: 'website' | 'file' | 'text' | 'faq';
  status: 'active' | 'processing' | 'error' | 'inactive';
  content?: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
  urls?: KnowledgeBaseUrl[];
  faqs?: KnowledgeBaseFaq[];
}

interface KnowledgeBaseUrl {
  id: string;
  knowledgeBaseId: string;
  url: string;
  status: 'pending' | 'crawled' | 'error';
  lastCrawled?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeBaseFaq {
  id: string;
  knowledgeBaseId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export const knowledgeBaseService = {
  // Get all knowledge bases for a chatbot
  getKnowledgeBasesByChatbotId: async (chatbotId: string): Promise<KnowledgeBase[]> => {
    try {
      const sql = 'SELECT * FROM knowledge_bases WHERE chatbot_id = ?';
      const results = await db.query(sql, [chatbotId]);
      
      if (!db.isRowDataPacketArray(results)) {
        return [];
      }
      
      const knowledgeBases = results.map(kb => ({
        id: kb.id,
        chatbotId: kb.chatbot_id,
        name: kb.name,
        type: kb.type,
        status: kb.status,
        content: kb.content,
        filePath: kb.file_path,
        createdAt: kb.created_at,
        updatedAt: kb.updated_at
      }));
      
      // For each knowledge base, fetch related URLs and FAQs
      for (const kb of knowledgeBases) {
        kb.urls = await knowledgeBaseService.getUrlsByKnowledgeBaseId(kb.id);
        kb.faqs = await knowledgeBaseService.getFaqsByKnowledgeBaseId(kb.id);
      }
      
      return knowledgeBases;
    } catch (error) {
      console.error('Error in getKnowledgeBasesByChatbotId:', error);
      return [];
    }
  },
  
  // Get a single knowledge base by ID
  getKnowledgeBaseById: async (id: string): Promise<KnowledgeBase | null> => {
    try {
      const sql = 'SELECT * FROM knowledge_bases WHERE id = ?';
      const results = await db.query(sql, [id]);
      
      if (!db.isRowDataPacketArray(results) || results.length === 0) {
        return null;
      }
      
      const kb = results[0];
      const knowledgeBase = {
        id: kb.id,
        chatbotId: kb.chatbot_id,
        name: kb.name,
        type: kb.type,
        status: kb.status,
        content: kb.content,
        filePath: kb.file_path,
        createdAt: kb.created_at,
        updatedAt: kb.updated_at,
        urls: await knowledgeBaseService.getUrlsByKnowledgeBaseId(kb.id),
        faqs: await knowledgeBaseService.getFaqsByKnowledgeBaseId(kb.id)
      };
      
      return knowledgeBase;
    } catch (error) {
      console.error('Error in getKnowledgeBaseById:', error);
      return null;
    }
  },
  
  // Create a new knowledge base
  createKnowledgeBase: async (knowledgeBase: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeBase | null> => {
    try {
      const id = uuidv4();
      const sql = `
        INSERT INTO knowledge_bases (id, chatbot_id, name, type, status, content, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await db.query(sql, [
        id,
        knowledgeBase.chatbotId,
        knowledgeBase.name,
        knowledgeBase.type,
        knowledgeBase.status || 'active',
        knowledgeBase.content || null,
        knowledgeBase.filePath || null
      ]);
      
      // If it's a website type, add URLs
      if (knowledgeBase.type === 'website' && knowledgeBase.urls && knowledgeBase.urls.length > 0) {
        for (const url of knowledgeBase.urls) {
          await knowledgeBaseService.addUrl(id, url.url);
        }
      }
      
      // If it's a FAQ type, add FAQ pairs
      if (knowledgeBase.type === 'faq' && knowledgeBase.faqs && knowledgeBase.faqs.length > 0) {
        for (const faq of knowledgeBase.faqs) {
          await knowledgeBaseService.addFaq(id, faq.question, faq.answer);
        }
      }
      
      return knowledgeBaseService.getKnowledgeBaseById(id);
    } catch (error) {
      console.error('Error in createKnowledgeBase:', error);
      return null;
    }
  },
  
  // Update a knowledge base
  updateKnowledgeBase: async (id: string, updates: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> => {
    try {
      let sql = 'UPDATE knowledge_bases SET ';
      const params = [];
      const updateFields = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        params.push(updates.name);
      }
      if (updates.status !== undefined) {
        updateFields.push('status = ?');
        params.push(updates.status);
      }
      if (updates.content !== undefined) {
        updateFields.push('content = ?');
        params.push(updates.content);
      }
      if (updates.filePath !== undefined) {
        updateFields.push('file_path = ?');
        params.push(updates.filePath);
      }
      
      updateFields.push('updated_at = NOW()');
      
      sql += updateFields.join(', ') + ' WHERE id = ?';
      params.push(id);
      
      await db.query(sql, params);
      
      // Update URLs if provided
      if (updates.urls) {
        // Delete existing URLs
        await db.query('DELETE FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
        
        // Add new URLs
        for (const url of updates.urls) {
          await knowledgeBaseService.addUrl(id, url.url);
        }
      }
      
      // Update FAQs if provided
      if (updates.faqs) {
        // Delete existing FAQs
        await db.query('DELETE FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
        
        // Add new FAQs
        for (const faq of updates.faqs) {
          await knowledgeBaseService.addFaq(id, faq.question, faq.answer);
        }
      }
      
      return knowledgeBaseService.getKnowledgeBaseById(id);
    } catch (error) {
      console.error('Error in updateKnowledgeBase:', error);
      return null;
    }
  },
  
  // Delete a knowledge base
  deleteKnowledgeBase: async (id: string): Promise<boolean> => {
    try {
      // Delete URLs associated with this knowledge base
      await db.query('DELETE FROM knowledge_base_urls WHERE knowledge_base_id = ?', [id]);
      
      // Delete FAQs associated with this knowledge base
      await db.query('DELETE FROM knowledge_base_faqs WHERE knowledge_base_id = ?', [id]);
      
      // Delete the knowledge base
      await db.query('DELETE FROM knowledge_bases WHERE id = ?', [id]);
      
      return true;
    } catch (error) {
      console.error('Error in deleteKnowledgeBase:', error);
      return false;
    }
  },
  
  // Get all URLs for a knowledge base
  getUrlsByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<KnowledgeBaseUrl[]> => {
    try {
      const sql = 'SELECT * FROM knowledge_base_urls WHERE knowledge_base_id = ?';
      const results = await db.query(sql, [knowledgeBaseId]);
      
      if (!db.isRowDataPacketArray(results)) {
        return [];
      }
      
      return results.map(url => ({
        id: url.id,
        knowledgeBaseId: url.knowledge_base_id,
        url: url.url,
        status: url.status,
        lastCrawled: url.last_crawled,
        errorMessage: url.error_message,
        createdAt: url.created_at,
        updatedAt: url.updated_at
      }));
    } catch (error) {
      console.error('Error in getUrlsByKnowledgeBaseId:', error);
      return [];
    }
  },
  
  // Add a URL to a knowledge base
  addUrl: async (knowledgeBaseId: string, url: string): Promise<KnowledgeBaseUrl | null> => {
    try {
      const id = uuidv4();
      const sql = `
        INSERT INTO knowledge_base_urls (id, knowledge_base_id, url, status)
        VALUES (?, ?, ?, ?)
      `;
      
      await db.query(sql, [id, knowledgeBaseId, url, 'pending']);
      
      const results = await db.query(
        'SELECT * FROM knowledge_base_urls WHERE id = ?',
        [id]
      );
      
      if (!db.isRowDataPacketArray(results) || results.length === 0) {
        return null;
      }
      
      const urlData = results[0];
      return {
        id: urlData.id,
        knowledgeBaseId: urlData.knowledge_base_id,
        url: urlData.url,
        status: urlData.status,
        lastCrawled: urlData.last_crawled,
        errorMessage: urlData.error_message,
        createdAt: urlData.created_at,
        updatedAt: urlData.updated_at
      };
    } catch (error) {
      console.error('Error in addUrl:', error);
      return null;
    }
  },
  
  // Update URL status
  updateUrlStatus: async (id: string, status: 'pending' | 'crawled' | 'error', errorMessage?: string): Promise<boolean> => {
    try {
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
      
      await db.query(sql, params);
      return true;
    } catch (error) {
      console.error('Error in updateUrlStatus:', error);
      return false;
    }
  },
  
  // Get all FAQs for a knowledge base
  getFaqsByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<KnowledgeBaseFaq[]> => {
    try {
      const sql = 'SELECT * FROM knowledge_base_faqs WHERE knowledge_base_id = ?';
      const results = await db.query(sql, [knowledgeBaseId]);
      
      if (!db.isRowDataPacketArray(results)) {
        return [];
      }
      
      return results.map(faq => ({
        id: faq.id,
        knowledgeBaseId: faq.knowledge_base_id,
        question: faq.question,
        answer: faq.answer,
        createdAt: faq.created_at,
        updatedAt: faq.updated_at
      }));
    } catch (error) {
      console.error('Error in getFaqsByKnowledgeBaseId:', error);
      return [];
    }
  },
  
  // Add a FAQ to a knowledge base
  addFaq: async (knowledgeBaseId: string, question: string, answer: string): Promise<KnowledgeBaseFaq | null> => {
    try {
      const id = uuidv4();
      const sql = `
        INSERT INTO knowledge_base_faqs (id, knowledge_base_id, question, answer)
        VALUES (?, ?, ?, ?)
      `;
      
      await db.query(sql, [id, knowledgeBaseId, question, answer]);
      
      const results = await db.query(
        'SELECT * FROM knowledge_base_faqs WHERE id = ?',
        [id]
      );
      
      if (!db.isRowDataPacketArray(results) || results.length === 0) {
        return null;
      }
      
      const faqData = results[0];
      return {
        id: faqData.id,
        knowledgeBaseId: faqData.knowledge_base_id,
        question: faqData.question,
        answer: faqData.answer,
        createdAt: faqData.created_at,
        updatedAt: faqData.updated_at
      };
    } catch (error) {
      console.error('Error in addFaq:', error);
      return null;
    }
  }
};

export default knowledgeBaseService;
