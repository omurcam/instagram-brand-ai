import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { executeTool } from '@/lib/tools';

// URL detection and validation function
function detectWebsiteUrl(message: string): string | null {
  console.log('🔍 Analyzing message for URLs:', message);
  
  // URL regex patterns
  const urlPatterns = [
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/gi
  ];
  
  for (const pattern of urlPatterns) {
    const matches = message.match(pattern);
    if (matches) {
      let url = matches[0];
      console.log('🎯 Raw URL match:', url);
      
      // Clean up URL
      url = url.replace(/[.,;!?]+$/, ''); // Remove trailing punctuation
      url = url.replace(/[()]+$/, ''); // Remove trailing parentheses
      url = url.trim();
      
      // Add protocol if missing
      if (!url.startsWith('http')) {
        // Handle www. prefix
        if (url.startsWith('www.')) {
          url = 'https://' + url;
        } else {
          url = 'https://' + url;
        }
      }
      
      // Validate URL format
      try {
        const urlObj = new URL(url);
        console.log('✅ Valid URL detected:', urlObj.href);
        return urlObj.href;
      } catch (error) {
        console.log('❌ Invalid URL format:', url, error);
        continue; // Try next pattern
      }
    }
  }
  
  console.log('❌ No valid URL found in message');
  return null;
}

// URL validation function
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

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

WEB SİTESİ ANALİZ YETENEKLERİ:
- N8N workflow entegrasyonu ile detaylı web sitesi analizi
- SEO, performans, içerik ve tasarım değerlendirmesi
- Erişilebilirlik kontrolü
- Teknik sorun tespiti
- İyileştirme önerileri

ARAÇLAR:
- web_search: Web'de güncel bilgi arama
- calculator: Matematik hesaplamaları
- code_executor: JavaScript kodu çalıştırma
- get_weather: Hava durumu bilgisi
- analyze_website: Kapsamlı web sitesi analizi

Web sitesi analizi yaparken şu analiz türlerini kullanabilirsin:
- "full": Kapsamlı analiz (varsayılan)
- "seo": SEO odaklı analiz
- "performance": Performans analizi
- "content": İçerik analizi
- "design": Tasarım değerlendirmesi
- "accessibility": Erişilebilirlik kontrolü

Her zaman Türkçe yanıt ver ve pratik, uygulanabilir öneriler sun.

YANIT UZUNLUĞU:
- Detaylı ve kapsamlı yanıtlar ver
- Örneklerle destekle
- Adım adım açıklamalar yap
- Yanıtını yarıda kesme, tam tamamla
- Gerekirse uzun açıklamalar yap`;

// Tool calling implementation
const getToolsSchema = () => {
  return [
    {
      type: "function" as const,
      function: {
        name: "analyze_website",
        description: "Analyze websites to identify issues, improvements, and optimization opportunities",
        parameters: {
          type: "object",
          properties: {
            website_url: {
              type: "string",
              description: "The URL of the website to analyze (e.g., 'https://example.com')"
            },
            analysis_type: {
              type: "string",
              description: "Type of analysis: 'full', 'seo', 'performance', 'content', 'design', 'accessibility'"
            },
            focus_areas: {
              type: "array",
              description: "Specific areas to focus on (optional)"
            }
          },
          required: ["website_url"]
        }
      }
    }
  ];
};

export async function POST(request: NextRequest) {
  console.log('🚀 API Route called');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('📝 Request body parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check environment variables
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL;
    
    console.log('🔑 API Key exists:', hasApiKey);
    console.log('🌐 Base URL:', baseUrl);
    
    if (!hasApiKey) {
      console.error('❌ No API key found');
      return new Response(JSON.stringify({ 
        error: 'API key not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('📝 Request received:', { 
      hasMessage: !!body.message, 
      messageLength: body.message?.length,
      bodyKeys: Object.keys(body)
    });
    
    const { message, enableThinking = false, conversationHistory = [] } = body;
    
    if (!message) {
      console.log('No message provided');
      return new Response(JSON.stringify({ error: 'Message is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if message contains a website URL
    const detectedUrl = detectWebsiteUrl(message);
    console.log('🔍 URL detected:', detectedUrl);

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
            controller.enqueue(new TextEncoder().encode('🤔 **Düşünüyor...**\n\n'));
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          // If URL detected, automatically analyze it
          if (detectedUrl) {
            console.log('🔍 Starting automatic website analysis for:', detectedUrl);
            
            controller.enqueue(new TextEncoder().encode(`🔍 **Web sitesi tespit edildi:** ${detectedUrl}\n\n`));
            controller.enqueue(new TextEncoder().encode('🔄 **N8N workflow ile analiz başlatılıyor...**\n\n'));
            controller.enqueue(new TextEncoder().encode('⏳ **Lütfen bekleyin, site taranıyor...**\n\n'));
            
            try {
              // Call N8N workflow directly
              const analysisResult = await executeTool('analyze_website', {
                website_url: detectedUrl,
                analysis_type: 'full'
              });
              
              controller.enqueue(new TextEncoder().encode(analysisResult));
              controller.enqueue(new TextEncoder().encode('\n\n---\n\n'));
              
              // Then get AI interpretation
              const aiMessages = [
                { role: "system", content: "Sen bir web sitesi analiz uzmanısın. N8N workflow'undan gelen analiz sonuçlarını yorumla ve kullanıcıya kapsamlı, detaylı öneriler sun. Teknik terimleri basit dille açıkla. Yanıtını tam tamamla, yarıda kesme. Uzun ve detaylı açıklamalar yap." },
                { role: "user", content: `Bu web sitesi analiz sonuçlarını detaylı şekilde yorumla ve kullanıcıya kapsamlı öneriler ver:\n\nSite: ${detectedUrl}\nAnaliz Sonucu: ${analysisResult}\n\nDetaylı analiz yap ve şunlara odaklan:\n- Sitenin genel durumu ve performansı\n- Kritik sorunlar varsa öncelik sıralaması\n- Adım adım iyileştirme önerileri\n- Kullanıcı deneyimi açısından detaylı değerlendirme\n- SEO ve teknik öneriler\n- Tasarım ve içerik önerileri\n- Uzun vadeli strateji önerileri\n\nLütfen yanıtını tam tamamla ve detaylı açıklamalar yap.` }
              ];
              
              controller.enqueue(new TextEncoder().encode('🤖 **AI Yorumu:**\n\n'));
              
              const completion = await openai.chat.completions.create({
                model: "moonshotai/kimi-k2-instruct",
                messages: aiMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
                temperature: 0.6,
                max_tokens: 8192, // Increased from 2048
                stream: true
              });

              for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              }
              
            } catch (analysisError) {
              console.error('❌ Website analysis error:', analysisError);
              controller.enqueue(new TextEncoder().encode(`❌ **Analiz Hatası:** ${analysisError instanceof Error ? analysisError.message : 'Bilinmeyen hata'}\n\n`));
              
              // Fallback to regular AI response
              const completion = await openai.chat.completions.create({
                model: "moonshotai/kimi-k2-instruct",
                messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
                temperature: 0.6,
                max_tokens: 8192, // Increased from 4096
                stream: true
              });

              for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              }
            }
            
          } else {
            // Regular AI response for non-URL messages
            console.log('🤖 Starting regular AI response...');
            
            const completion = await openai.chat.completions.create({
              model: "moonshotai/kimi-k2-instruct",
              messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
              temperature: 0.6,
              max_tokens: 8192, // Increased from 4096
              stream: true
            });

            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
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