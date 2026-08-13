import type { Handler } from '@netlify/functions';

interface DiagnosticsRequest {
  repoUrl: string;
  personas: string[];
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload: DiagnosticsRequest;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!payload.repoUrl || !/^https?:\/\//.test(payload.repoUrl)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'A valid repository URL is required' }),
    };
  }

  if (!Array.isArray(payload.personas) || payload.personas.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Select at least one persona' }),
    };
  }

  // TODO: call Anthropic Claude or OpenAI here with the persona prompts.
  // The API key must live in ANTHROPIC_API_KEY / OPENAI_API_KEY on the
  // Netlify side and is never exposed to the frontend.
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      acknowledged: true,
      repoUrl: payload.repoUrl,
      personas: payload.personas,
      note: 'AI call not yet wired. Frontend mock will populate the log.',
    }),
  };
};
