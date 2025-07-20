// Tool definitions for the AI agent
export interface Tool {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
    execute: (params: any) => Promise<string>;
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
    execute: async (params: { query: string }) => {
        // Simulated web search with more realistic responses
        const searchTopics = {
            'react': 'React is a popular JavaScript library for building user interfaces. Latest version is React 18 with concurrent features.',
            'javascript': 'JavaScript is a versatile programming language. ES2024 features include temporal API and pattern matching.',
            'ai': 'Artificial Intelligence is rapidly evolving. Latest developments include GPT-4, Claude, and multimodal AI systems.',
            'weather': 'Weather information varies by location. Current global climate patterns show seasonal variations.',
            'technology': 'Technology trends in 2025 include AI integration, quantum computing advances, and sustainable tech solutions.'
        };

        const query = params.query.toLowerCase();
        let result = '';

        for (const [topic, info] of Object.entries(searchTopics)) {
            if (query.includes(topic)) {
                result = `🔍 Web Search Results for "${params.query}":\n\n${info}\n\nSource: Multiple web sources aggregated`;
                break;
            }
        }

        if (!result) {
            result = `🔍 Web Search Results for "${params.query}":\n\nFound relevant information from multiple sources. The topic appears to be current and has recent discussions in the community.`;
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
    execute: async (params: { expression: string }) => {
        try {
            // Enhanced math evaluation with better safety
            const sanitized = params.expression
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

            return `🧮 **Calculation Result:**\n${params.expression} = **${result}**\n\n${result % 1 === 0 ? 'Integer result' : 'Decimal result'}`;
        } catch (error) {
            return `❌ **Calculation Error:** "${params.expression}" is not a valid mathematical expression.\n\nSupported operations: +, -, *, /, parentheses\nExample: "25 * 47" or "(10 + 5) * 2"`;
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
    execute: async (params: { code: string }) => {
        try {
            // Simulate code execution (in production, use a sandboxed environment)
            await new Promise(resolve => setTimeout(resolve, 500));
            return `Kod çalıştırıldı:\n\`\`\`javascript\n${params.code}\n\`\`\`\n\nSonuç: Kod başarıyla çalıştırıldı.`;
        } catch (error) {
            return `Kod çalıştırma hatası: ${error}`;
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
    execute: async (params: { location: string }) => {
        const mockWeather = [
            `${params.location} için hava durumu: 22°C, Güneşli`,
            `${params.location} şu anda 18°C, Bulutlu`,
            `${params.location} hava durumu: 25°C, Parçalı bulutlu`
        ];

        await new Promise(resolve => setTimeout(resolve, 800));
        return mockWeather[Math.floor(Math.random() * mockWeather.length)];
    }
};

// All available tools
export const availableTools: Tool[] = [
    webSearchTool,
    calculatorTool,
    codeExecutorTool,
    weatherTool
];

// Tool execution function
export async function executeTool(toolName: string, parameters: any): Promise<string> {
    const tool = availableTools.find(t => t.name === toolName);
    if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
    }

    return await tool.execute(parameters);
}