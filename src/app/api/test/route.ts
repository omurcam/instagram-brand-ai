import { NextRequest } from 'next/server';

export async function GET() {
  console.log('🧪 Test API called');
  return new Response(JSON.stringify({ 
    status: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'not set',
      nodeEnv: process.env.NODE_ENV
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({ 
      status: 'POST working',
      received: body,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to parse JSON',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}