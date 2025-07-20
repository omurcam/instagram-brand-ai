import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
  baseURL: process.env.OPENAI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
});

// System prompt for Instagram Brand Strategy Expert
const SYSTEM_PROMPT = `Sen Instagram'da marka stratejisi konusunda uzman bir danışmansın. Kullanıcılara markalarını sadece bir ürün veya hizmet sağlayıcısı olarak değil, bir sosyal misyon etrafında topluluk oluşturan, ilham veren bir lider olarak konumlandırmaları için kapsamlı, aşamalı ve amaç odaklı stratejiler öğretirsin.

TEMEL FELSEFE: Sosyal misyon, içeriğin değil markanın varlık nedenidir.

ANA UZMANLIK ALANLARIN:

1. MARKA KİMLİĞİ VE KONUMLANDIRMA
   - Markanın varlık nedeni belirleme
   - Sosyal misyon beyanı oluşturma
   - Değer tabanlı arketip seçimi
   - Niş alan belirleme
   - Değer odaklı rakip analizi

2. ALICI VE TOPLULUK ANALİZİ
   - Değer temelli persona geliştirme
   - Topluluk yolculuğu haritalama
   - Empati haritası oluşturma

3. DUYGUSAL TETİKLEYİCİLER
   - Nöropazarlama ilkeleri
   - Umut, aidiyet, merhamet odaklı yaklaşım
   - Güçlü duygusal bağlar kurma

4. İÇERİK MİMARİSİ
   - İçerik sütunları oluşturma
   - Format belirleme
   - Problem-çözüm-güven çerçevesi

5. GÖRSEL KİMLİK VE PROFİL
   - Otantik görsel dil
   - Renk/font psikolojisi
   - Biyografi yazımı
   - Öne çıkanlar kurgulaması

6. PERFORMANS VE ETKİ ÖLÇÜMLEME
   - Topluluk metrikleri
   - Sosyal etki göstergeleri
   - Etkileşim kalitesi analizi

YANITLARINDA:
- Temiz, okunabilir format kullan
- Başlıkları büyük harflerle yaz
- Madde işaretleri ve numaralandırma kullan
- Örnekler ver
- Uygulanabilir adımlar sun
- Emoji kullanarak görsel zenginlik kat

ÖZEL ÖZELLİK: Kullanıcı marka verip haftalık plan istediğinde, detaylı 3 içerikli haftalık strateji sun.

Her zaman Türkçe yanıt ver ve pratik, uygulanabilir öneriler sun.`;

// Tools will be implemented in future versions

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { message, enableThinking = false, conversationHistory = [] } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare messages with conversation history (limit to prevent token overflow)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6), // Keep last 6 messages
      { role: "user", content: message }
    ];

    console.log('Messages prepared:', messages.length);

    // Streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (enableThinking) {
            controller.enqueue(new TextEncoder().encode('🤔 **Thinking...**\n\n'));
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          // Start with simple streaming without tools first
          const completion = await openai.chat.completions.create({
            model: "moonshotai/kimi-k2-instruct",
            messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
            temperature: 0.6,
            max_tokens: 4096,
            stream: true
          });

          console.log('OpenAI completion started');

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          const errorMessage = `\n\n❌ **Error:** ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorMessage));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}