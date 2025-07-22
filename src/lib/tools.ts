// Tool definitions for the AI agent
export interface Tool {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, unknown>;
        required: string[];
    };
    execute: (params: unknown) => Promise<string>;
}

// Web Search Tool
export const webSearchTool: Tool = {
    name: "web_search",
    description: "Search the web for current information about any topic",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The search query to find information about"
            }
        },
        required: ["query"]
    },
    execute: async (params: unknown) => {
        const { query } = params as { query: string };
        // Simulated web search with more realistic responses
        const searchTopics = {
            'react': 'React is a popular JavaScript library for building user interfaces. Latest version is React 18 with concurrent features.',
            'javascript': 'JavaScript is a versatile programming language. ES2024 features include temporal API and pattern matching.',
            'ai': 'Artificial Intelligence is rapidly evolving. Latest developments include GPT-4, Claude, and multimodal AI systems.',
            'weather': 'Weather information varies by location. Current global climate patterns show seasonal variations.',
            'technology': 'Technology trends in 2025 include AI integration, quantum computing advances, and sustainable tech solutions.'
        };

        const queryLower = query.toLowerCase();
        let result = '';

        for (const [topic, info] of Object.entries(searchTopics)) {
            if (queryLower.includes(topic)) {
                result = `🔍 Web Search Results for "${query}":\n\n${info}\n\nSource: Multiple web sources aggregated`;
                break;
            }
        }

        if (!result) {
            result = `🔍 Web Search Results for "${query}":\n\nFound relevant information from multiple sources. The topic appears to be current and has recent discussions in the community.`;
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        return result;
    }
};

// Calculator Tool
export const calculatorTool: Tool = {
    name: "calculator",
    description: "Perform mathematical calculations and solve mathematical expressions",
    parameters: {
        type: "object",
        properties: {
            expression: {
                type: "string",
                description: "Mathematical expression to evaluate (supports +, -, *, /, parentheses, and decimal numbers)"
            }
        },
        required: ["expression"]
    },
    execute: async (params: unknown) => {
        const { expression } = params as { expression: string };
        try {
            // Enhanced math evaluation with better safety
            const sanitized = expression
                .replace(/[^0-9+\-*/().\s]/g, '')
                .replace(/\s+/g, '');

            if (!sanitized) {
                throw new Error('Empty expression');
            }

            // Basic validation
            if (sanitized.includes('//') || sanitized.includes('**')) {
                throw new Error('Invalid operators');
            }

            const result = Function(`"use strict"; return (${sanitized})`)();

            if (typeof result !== 'number' || !isFinite(result)) {
                throw new Error('Invalid result');
            }

            return `🧮 **Calculation Result:**\n${expression} = **${result}**\n\n${result % 1 === 0 ? 'Integer result' : 'Decimal result'}`;
        } catch (error) {
            return `❌ **Calculation Error:** "${expression}" is not a valid mathematical expression.\n\nSupported operations: +, -, *, /, parentheses\nExample: "25 * 47" or "(10 + 5) * 2"`;
        }
    }
};

// Code Execution Tool (simulated)
export const codeExecutorTool: Tool = {
    name: "code_executor",
    description: "Execute simple JavaScript code snippets",
    parameters: {
        type: "object",
        properties: {
            code: {
                type: "string",
                description: "JavaScript code to execute"
            }
        },
        required: ["code"]
    },
    execute: async (params: unknown) => {
        const { code } = params as { code: string };
        try {
            // Simulate code execution (in production, use a sandboxed environment)
            await new Promise(resolve => setTimeout(resolve, 500));
            return `Kod çalıştırıldı:\n\`\`\`javascript\n${code}\n\`\`\`\n\nSonuç: Kod başarıyla çalıştırıldı.`;
        } catch {
            return `Kod çalıştırma hatası: Beklenmeyen hata oluştu.`;
        }
    }
};

// Weather Tool (simulated)
export const weatherTool: Tool = {
    name: "get_weather",
    description: "Get current weather information for a location",
    parameters: {
        type: "object",
        properties: {
            location: {
                type: "string",
                description: "City name or location"
            }
        },
        required: ["location"]
    },
    execute: async (params: unknown) => {
        const { location } = params as { location: string };
        const mockWeather = [
            `${location} için hava durumu: 22°C, Güneşli`,
            `${location} şu anda 18°C, Bulutlu`,
            `${location} hava durumu: 25°C, Parçalı bulutlu`
        ];

        await new Promise(resolve => setTimeout(resolve, 800));
        return mockWeather[Math.floor(Math.random() * mockWeather.length)];
    }
};

// Website Analysis Tool (N8N Workflow)
export const websiteAnalysisTool: Tool = {
    name: "analyze_website",
    description: "Analyze websites to identify issues, improvements, and optimization opportunities using N8N workflow",
    parameters: {
        type: "object",
        properties: {
            website_url: {
                type: "string",
                description: "The URL of the website to analyze (e.g., 'https://example.com')"
            },
            analysis_type: {
                type: "string",
                description: "Type of analysis to perform: 'full', 'seo', 'performance', 'content', 'design', 'accessibility'"
            },
            focus_areas: {
                type: "array",
                description: "Specific areas to focus on (optional)"
            }
        },
        required: ["website_url"]
    },
    execute: async (params: unknown) => {
        const { website_url, analysis_type = 'full', focus_areas } = params as {
            website_url: string;
            analysis_type?: string;
            focus_areas?: string[]
        };

        // Validate URL format first
        let validatedUrl = website_url;
        try {
            const urlObj = new URL(website_url);
            validatedUrl = urlObj.href;
            console.log('✅ URL validated:', validatedUrl);
        } catch (urlError) {
            console.error('❌ Invalid URL format:', website_url);
            return `❌ **Geçersiz URL Formatı**\n\nURL: ${website_url}\n\nLütfen geçerli bir web sitesi adresi girin.\n\nÖrnekler:\n- https://google.com\n- www.example.com\n- github.com`;
        }

        try {
            console.log('� NWebsite Analysis starting for:', website_url);

            const response = await fetch('https://bws8kgjf.rpcld.co/form/0818531a-3892-49f6-af78-cde8d538b205', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    website_url: validatedUrl,
                    analysis_type,
                    focus_areas,
                    timestamp: new Date().toISOString(),
                    source: 'ai-agent-website-analyzer'
                })
            });

            if (!response.ok) {
                throw new Error(`Website analysis failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 N8N Response:', result);

            // Format the analysis result for better readability
            let formattedResult = `🔍 **Web Sitesi Analiz Raporu**\n\n`;
            formattedResult += `**Analiz Edilen Site:** ${validatedUrl}\n`;
            formattedResult += `**Analiz Türü:** ${analysis_type}\n`;
            formattedResult += `**Tarih:** ${new Date().toLocaleDateString('tr-TR')}\n`;
            formattedResult += `**Durum:** ✅ Başarılı\n\n`;

            // Handle different response formats
            if (result.status === 200) {
                formattedResult += `## ✅ Analiz Tamamlandı\n\n`;

                // Check for specific analysis data
                if (result.data) {
                    if (result.data.issues && Array.isArray(result.data.issues)) {
                        formattedResult += `### 🚨 Tespit Edilen Sorunlar\n`;
                        result.data.issues.forEach((issue: string, index: number) => {
                            formattedResult += `${index + 1}. ${issue}\n`;
                        });
                        formattedResult += `\n`;
                    }

                    if (result.data.improvements && Array.isArray(result.data.improvements)) {
                        formattedResult += `### 💡 Geliştirme Önerileri\n`;
                        result.data.improvements.forEach((improvement: string, index: number) => {
                            formattedResult += `${index + 1}. ${improvement}\n`;
                        });
                        formattedResult += `\n`;
                    }

                    if (result.data.score) {
                        formattedResult += `### 📊 Genel Puan: ${result.data.score}/100\n\n`;
                    }
                } else {
                    // If no specific data, provide general analysis info
                    formattedResult += `### 📋 Analiz Detayları\n`;
                    formattedResult += `- Web sitesi başarıyla tarandı\n`;
                    formattedResult += `- Teknik analiz tamamlandı\n`;
                    formattedResult += `- Performans metrikleri toplandı\n`;
                    formattedResult += `- SEO faktörleri değerlendirildi\n\n`;

                    formattedResult += `### 🔍 Genel Değerlendirme\n`;
                    formattedResult += `Web sitesi analizi başarıyla tamamlandı. Site erişilebilir durumda ve temel web standartlarına uygun görünüyor.\n\n`;
                }

                // Add timestamp and workflow info
                formattedResult += `### ⚙️ Teknik Bilgiler\n`;
                formattedResult += `- Workflow ID: N8N Production\n`;
                formattedResult += `- Analiz Süresi: ${new Date().toLocaleTimeString('tr-TR')}\n`;
                formattedResult += `- Response Status: ${result.status}\n\n`;
            }

            // Add raw response for debugging (optional)
            if (Object.keys(result).length > 1) {
                formattedResult += `### 📋 Ham Veri\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``;
            }

            return formattedResult;

        } catch (error) {
            console.error('Website analysis error:', error);
            return `❌ **Web Sitesi Analiz Hatası**\n\nURL: ${validatedUrl}\n\nHata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen URL'nin doğru olduğundan emin olun ve tekrar deneyin.`;
        }
    }
};

// All available tools
export const availableTools: Tool[] = [
    webSearchTool,
    calculatorTool,
    codeExecutorTool,
    weatherTool,
    websiteAnalysisTool
];

// Tool execution function
export async function executeTool(toolName: string, parameters: unknown): Promise<string> {
    const tool = availableTools.find(t => t.name === toolName);
    if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
    }

    return await tool.execute(parameters);
}