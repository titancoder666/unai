import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { detectPatterns, calculateAIScore } from '@/lib/patterns';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are UnAI, an expert writing editor that removes AI-generated writing clichés and makes text sound naturally human.

Your job: Rewrite the user's text to eliminate ChatGPT-style patterns while preserving the original meaning, tone, and information.

RULES:
1. Preserve ALL factual content and meaning
2. Remove these Chinese AI patterns:
   - "不是...而是..." → State the point directly
   - "值得注意的是" / "需要指出的是" → Delete, just say it
   - "让我们深入探讨" → Delete, start analyzing
   - "总而言之" / "综上所述" → Delete or use natural conclusion
   - "简单来说" / "一句话概括" → Delete
   - "不仅...而且..." → Split into separate statements
   - "事实上" → Delete or use "其实"
   - Meta-narration like "接下来我会..." → Delete
   - "兜住" "接住" "收敛" "坍缩" (non-technical) → Use natural words
   - Excessive single-character words (拆/搞/拉/改)
   - Hedging: "可能" "大概" "似乎" when unnecessary

3. Remove these English AI patterns:
   - "It's worth noting that" / "It's important to note" → Delete
   - "Let's delve into" → Delete
   - "In today's rapidly evolving..." → Be specific
   - "Furthermore" / "Moreover" → "Also" / "And" / delete
   - "In conclusion" → Delete
   - "Not X, but Y" → State Y directly
   - "Great question!" / "Absolutely!" → Delete
   - "I'd be happy to help" → Delete
   - Overuse of em dashes

4. Make text flow naturally — like a real human wrote it
5. Keep the same language as input (Chinese stays Chinese, English stays English)
6. Maintain the author's intended voice and expertise level
7. Don't over-simplify — just remove the AI-ness
8. Use natural transitions instead of formulaic ones

OUTPUT: Return ONLY the rewritten text, nothing else. No explanations.`;

export async function POST(req: Request) {
  try {
    const { text, mode = 'balanced' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text too long (max 10,000 characters)' }, { status: 400 });
    }

    // Step 1: Detect patterns
    const detected = detectPatterns(text);
    const originalScore = calculateAIScore(text);

    // Step 2: LLM rewrite
    const intensity = mode === 'light' ? 'Make minimal changes, only fix the most obvious AI patterns.' :
                      mode === 'aggressive' ? 'Aggressively rewrite to sound completely human. Restructure sentences freely.' :
                      'Balance naturalness with preserving the original structure.';

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n\nIntensity: ' + intensity },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
      max_tokens: Math.min(text.length * 2, 4096),
    });

    const rewritten = completion.choices[0]?.message?.content || text;
    const newScore = calculateAIScore(rewritten);
    const newDetected = detectPatterns(rewritten);

    return NextResponse.json({
      original: text,
      rewritten,
      originalScore,
      newScore,
      patternsFound: detected.length,
      patternsRemaining: newDetected.length,
      patterns: detected.map(d => ({
        id: d.pattern.id,
        pattern: d.pattern.description,
        category: d.pattern.category,
        severity: d.pattern.severity,
        count: Math.max(d.matches.length, 1),
      })),
      mode,
    });
  } catch (error: unknown) {
    console.error('Rewrite error:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
