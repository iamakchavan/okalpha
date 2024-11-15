import { AI_CONFIG } from '../ai-config';

export async function queryPerplexity(prompt: string): Promise<string> {
  try {
    const response = await fetch(AI_CONFIG.perplexity.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.perplexity.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.perplexity.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that provides accurate and detailed information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Perplexity API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity Error:', error);
    throw new Error('Perplexity service unavailable');
  }
}