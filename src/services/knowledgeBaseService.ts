import { supabase } from "@/integrations/supabase/client";

export interface KnowledgeBase {
  id: string;
  chatbotId: string;
  name: string;
  type: 'website' | 'file' | 'text' | 'faq';
  status: 'active' | 'inactive';
  content?: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
  urls?: KnowledgeBaseUrl[];
  faqs?: KnowledgeBaseFaq[];
}

export interface KnowledgeBaseUrl {
  id: string;
  knowledgeBaseId: string;
  url: string;
  status: 'pending' | 'crawled' | 'error';
  lastCrawled?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseFaq {
  id: string;
  knowledgeBaseId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export const knowledgeBaseService = {
  getKnowledgeBasesByChatbotId: async (chatbotId: string): Promise<KnowledgeBase[]> => {
    try {
      const { data, error } = await supabase
        .from('knowledge_bases')
        .select(`
          *,
          knowledge_base_urls(*),
          knowledge_base_faqs(*)
        `)
        .eq('chatbot_id', chatbotId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((kb: any) => ({
        id: kb.id,
        chatbotId: kb.chatbot_id,
        name: kb.name,
        type: kb.type as 'website' | 'file' | 'text' | 'faq',
        status: kb.status as 'active' | 'inactive',
        content: kb.content,
        filePath: kb.file_path,
        createdAt: kb.created_at,
        updatedAt: kb.updated_at,
        urls: (kb.knowledge_base_urls || []).map((url: any) => ({
          id: url.id,
          knowledgeBaseId: url.knowledge_base_id,
          url: url.url,
          status: url.status,
          lastCrawled: url.last_crawled,
          errorMessage: url.error_message,
          createdAt: url.created_at,
          updatedAt: url.updated_at
        })),
        faqs: (kb.knowledge_base_faqs || []).map((faq: any) => ({
          id: faq.id,
          knowledgeBaseId: faq.knowledge_base_id,
          question: faq.question,
          answer: faq.answer,
          createdAt: faq.created_at,
          updatedAt: faq.updated_at
        }))
      }));
    } catch (error) {
      console.error('Error in getKnowledgeBasesByChatbotId:', error);
      return [];
    }
  },

  getKnowledgeBaseById: async (id: string): Promise<KnowledgeBase | null> => {
    try {
      const { data, error } = await supabase
        .from('knowledge_bases')
        .select(`
          *,
          knowledge_base_urls(*),
          knowledge_base_faqs(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return {
        id: data.id,
        chatbotId: data.chatbot_id,
        name: data.name,
        type: data.type as 'website' | 'file' | 'text' | 'faq',
        status: data.status as 'active' | 'inactive',
        content: data.content,
        filePath: data.file_path,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        urls: (data.knowledge_base_urls || []).map((url: any) => ({
          id: url.id,
          knowledgeBaseId: url.knowledge_base_id,
          url: url.url,
          status: url.status,
          lastCrawled: url.last_crawled,
          errorMessage: url.error_message,
          createdAt: url.created_at,
          updatedAt: url.updated_at
        })),
        faqs: (data.knowledge_base_faqs || []).map((faq: any) => ({
          id: faq.id,
          knowledgeBaseId: faq.knowledge_base_id,
          question: faq.question,
          answer: faq.answer,
          createdAt: faq.created_at,
          updatedAt: faq.updated_at
        }))
      };
    } catch (error) {
      console.error('Error in getKnowledgeBaseById:', error);
      return null;
    }
  },

  createKnowledgeBase: async (knowledgeBase: {
    chatbotId: string;
    name: string;
    type: 'website' | 'file' | 'text' | 'faq';
    status?: 'active' | 'inactive';
    content?: string;
    filePath?: string;
    urlInputs?: { url: string }[];
    faqInputs?: { question: string; answer: string }[];
  }): Promise<KnowledgeBase | null> => {
    try {
      // Create the knowledge base
      const { data: kbData, error: kbError } = await supabase
        .from('knowledge_bases')
        .insert({
          chatbot_id: knowledgeBase.chatbotId,
          name: knowledgeBase.name,
          type: knowledgeBase.type,
          status: knowledgeBase.status || 'active',
          content: knowledgeBase.content || null,
          file_path: knowledgeBase.filePath || null
        })
        .select()
        .single();

      if (kbError) throw kbError;

      // Add URLs if provided
      if (knowledgeBase.type === 'website' && knowledgeBase.urlInputs && knowledgeBase.urlInputs.length > 0) {
        const urlData = knowledgeBase.urlInputs.map(urlInput => ({
          knowledge_base_id: kbData.id,
          url: urlInput.url,
          status: 'pending' as const
        }));

        const { error: urlError } = await supabase
          .from('knowledge_base_urls')
          .insert(urlData);

        if (urlError) throw urlError;
      }

      // Add FAQs if provided
      if (knowledgeBase.type === 'faq' && knowledgeBase.faqInputs && knowledgeBase.faqInputs.length > 0) {
        const faqData = knowledgeBase.faqInputs.map(faqInput => ({
          knowledge_base_id: kbData.id,
          question: faqInput.question,
          answer: faqInput.answer
        }));

        const { error: faqError } = await supabase
          .from('knowledge_base_faqs')
          .insert(faqData);

        if (faqError) throw faqError;
      }

      return knowledgeBaseService.getKnowledgeBaseById(kbData.id);
    } catch (error) {
      console.error('Error in createKnowledgeBase:', error);
      return null;
    }
  },

  updateKnowledgeBase: async (id: string, updates: {
    name?: string;
    status?: 'active' | 'inactive';
    content?: string;
    filePath?: string;
    urls?: { url: string }[];
    faqs?: { question: string; answer: string }[];
  }): Promise<KnowledgeBase | null> => {
    try {
      // Update the main knowledge base record
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.filePath !== undefined) updateData.file_path = updates.filePath;

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('knowledge_bases')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;
      }

      // Update URLs if provided
      if (updates.urls) {
        // Delete existing URLs
        await supabase
          .from('knowledge_base_urls')
          .delete()
          .eq('knowledge_base_id', id);

        // Insert new URLs
        if (updates.urls.length > 0) {
          const urlData = updates.urls.map(url => ({
            knowledge_base_id: id,
            url: url.url,
            status: 'pending' as const
          }));

          const { error: urlError } = await supabase
            .from('knowledge_base_urls')
            .insert(urlData);

          if (urlError) throw urlError;
        }
      }

      // Update FAQs if provided
      if (updates.faqs) {
        // Delete existing FAQs
        await supabase
          .from('knowledge_base_faqs')
          .delete()
          .eq('knowledge_base_id', id);

        // Insert new FAQs
        if (updates.faqs.length > 0) {
          const faqData = updates.faqs.map(faq => ({
            knowledge_base_id: id,
            question: faq.question,
            answer: faq.answer
          }));

          const { error: faqError } = await supabase
            .from('knowledge_base_faqs')
            .insert(faqData);

          if (faqError) throw faqError;
        }
      }

      return knowledgeBaseService.getKnowledgeBaseById(id);
    } catch (error) {
      console.error('Error in updateKnowledgeBase:', error);
      return null;
    }
  },

  deleteKnowledgeBase: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('knowledge_bases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteKnowledgeBase:', error);
      return false;
    }
  }
};

export default knowledgeBaseService;
