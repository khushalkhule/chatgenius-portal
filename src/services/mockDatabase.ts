
// Mock database service that uses localStorage instead of MySQL
const mockDb = {
  query: async (sql: string, params: any[] = []): Promise<any[]> => {
    console.log('Mock DB Query:', sql, params);
    
    // Simple routing based on the query
    if (sql.includes('SELECT') && sql.includes('FROM knowledge_bases')) {
      return mockQueries.getKnowledgeBases(params);
    } else if (sql.includes('SELECT') && sql.includes('FROM knowledge_base_urls')) {
      return mockQueries.getKnowledgeBaseUrls(params);
    } else if (sql.includes('SELECT') && sql.includes('FROM knowledge_base_faqs')) {
      return mockQueries.getKnowledgeBaseFaqs(params);
    } else if (sql.includes('INSERT INTO knowledge_bases')) {
      return mockQueries.insertKnowledgeBase(params);
    } else if (sql.includes('INSERT INTO knowledge_base_urls')) {
      return mockQueries.insertKnowledgeBaseUrl(params);
    } else if (sql.includes('INSERT INTO knowledge_base_faqs')) {
      return mockQueries.insertKnowledgeBaseFaq(params);
    } else if (sql.includes('DELETE FROM knowledge_base_urls')) {
      return mockQueries.deleteKnowledgeBaseUrls(params);
    } else if (sql.includes('DELETE FROM knowledge_base_faqs')) {
      return mockQueries.deleteKnowledgeBaseFaqs(params);
    } else if (sql.includes('DELETE FROM knowledge_bases')) {
      return mockQueries.deleteKnowledgeBase(params);
    } else if (sql.includes('UPDATE knowledge_bases')) {
      return mockQueries.updateKnowledgeBase(params);
    }
    
    return [];
  }
};

const mockQueries = {
  getKnowledgeBases: (params: any[]): any[] => {
    const chatbotId = params[0];
    const storedKbs = localStorage.getItem('mockKnowledgeBases');
    if (!storedKbs) return [];
    
    const kbs = JSON.parse(storedKbs);
    return kbs.filter((kb: any) => kb.chatbot_id === chatbotId);
  },
  
  getKnowledgeBaseUrls: (params: any[]): any[] => {
    const kbId = params[0];
    const storedUrls = localStorage.getItem('mockKnowledgeBaseUrls');
    if (!storedUrls) return [];
    
    const urls = JSON.parse(storedUrls);
    return urls.filter((url: any) => url.knowledge_base_id === kbId);
  },
  
  getKnowledgeBaseFaqs: (params: any[]): any[] => {
    const kbId = params[0];
    const storedFaqs = localStorage.getItem('mockKnowledgeBaseFaqs');
    if (!storedFaqs) return [];
    
    const faqs = JSON.parse(storedFaqs);
    return faqs.filter((faq: any) => faq.knowledge_base_id === kbId);
  },
  
  insertKnowledgeBase: (params: any[]): any[] => {
    const [id, chatbotId, name, type, status, content, filePath] = params;
    
    const newKb = {
      id,
      chatbot_id: chatbotId,
      name,
      type,
      status,
      content,
      file_path: filePath,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const storedKbs = localStorage.getItem('mockKnowledgeBases');
    const kbs = storedKbs ? JSON.parse(storedKbs) : [];
    kbs.push(newKb);
    localStorage.setItem('mockKnowledgeBases', JSON.stringify(kbs));
    
    return [];
  },
  
  insertKnowledgeBaseUrl: (params: any[]): any[] => {
    const [id, kbId, url, status] = params;
    
    const newUrl = {
      id,
      knowledge_base_id: kbId,
      url,
      status,
      last_crawled: null,
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const storedUrls = localStorage.getItem('mockKnowledgeBaseUrls');
    const urls = storedUrls ? JSON.parse(storedUrls) : [];
    urls.push(newUrl);
    localStorage.setItem('mockKnowledgeBaseUrls', JSON.stringify(urls));
    
    return [];
  },
  
  insertKnowledgeBaseFaq: (params: any[]): any[] => {
    const [id, kbId, question, answer] = params;
    
    const newFaq = {
      id,
      knowledge_base_id: kbId,
      question,
      answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const storedFaqs = localStorage.getItem('mockKnowledgeBaseFaqs');
    const faqs = storedFaqs ? JSON.parse(storedFaqs) : [];
    faqs.push(newFaq);
    localStorage.setItem('mockKnowledgeBaseFaqs', JSON.stringify(faqs));
    
    return [];
  },
  
  deleteKnowledgeBaseUrls: (params: any[]): any[] => {
    const kbId = params[0];
    
    const storedUrls = localStorage.getItem('mockKnowledgeBaseUrls');
    if (!storedUrls) return [];
    
    const urls = JSON.parse(storedUrls);
    const filteredUrls = urls.filter((url: any) => url.knowledge_base_id !== kbId);
    localStorage.setItem('mockKnowledgeBaseUrls', JSON.stringify(filteredUrls));
    
    return [];
  },
  
  deleteKnowledgeBaseFaqs: (params: any[]): any[] => {
    const kbId = params[0];
    
    const storedFaqs = localStorage.getItem('mockKnowledgeBaseFaqs');
    if (!storedFaqs) return [];
    
    const faqs = JSON.parse(storedFaqs);
    const filteredFaqs = faqs.filter((faq: any) => faq.knowledge_base_id !== kbId);
    localStorage.setItem('mockKnowledgeBaseFaqs', JSON.stringify(filteredFaqs));
    
    return [];
  },
  
  deleteKnowledgeBase: (params: any[]): any[] => {
    const kbId = params[0];
    
    const storedKbs = localStorage.getItem('mockKnowledgeBases');
    if (!storedKbs) return [];
    
    const kbs = JSON.parse(storedKbs);
    const filteredKbs = kbs.filter((kb: any) => kb.id !== kbId);
    localStorage.setItem('mockKnowledgeBases', JSON.stringify(filteredKbs));
    
    return [];
  },
  
  updateKnowledgeBase: (params: any[]): any[] => {
    // Last param is always the ID
    const id = params[params.length - 1];
    
    const storedKbs = localStorage.getItem('mockKnowledgeBases');
    if (!storedKbs) return [];
    
    const kbs = JSON.parse(storedKbs);
    const updatedKbs = kbs.map((kb: any) => {
      if (kb.id === id) {
        // Update fields based on the SQL query structure
        // This is a simplified approach
        return {
          ...kb,
          updated_at: new Date().toISOString()
        };
      }
      return kb;
    });
    
    localStorage.setItem('mockKnowledgeBases', JSON.stringify(updatedKbs));
    
    return [];
  }
};

export default mockDb;
