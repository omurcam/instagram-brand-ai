"use client"

import { useState } from 'react';
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { ChatMessages, Message } from '@/components/ui/chat-messages';
import { ModelInfo } from '@/components/ui/model-info';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string; content: string}>>([]);

  const handleSendMessage = async (content: string, options?: { enableThinking?: boolean; enableTools?: boolean }) => {
    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API çağrısı
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          enableThinking: options?.enableThinking || false,
          enableTools: options?.enableTools || false,
          conversationHistory: conversationHistory.slice(-10) // Keep last 10 exchanges
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Stream okuma
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No reader available');
      }

      let aiContent = '';
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        sender: 'ai',
        timestamp: new Date(),
      };

      // AI mesajını ekle (boş olarak)
      setMessages(prev => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        aiContent += chunk;
        
        // Mesajı güncelle
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: aiContent }
              : msg
          )
        );
      }
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: content },
        { role: "assistant", content: aiContent }
      ]);
      
    } catch (error) {
      console.error('Frontend Error:', error);
      
      let errorText = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        errorText = `Hata: ${error.message}`;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col pt-8">
        {messages.length === 0 && !isLoading ? (
          <ModelInfo />
        ) : (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-white/90 via-white/70 to-transparent backdrop-blur-sm">
        <AIChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}