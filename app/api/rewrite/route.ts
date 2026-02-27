import { NextResponse } from 'next/server';

// Inline pattern detection
const PATTERNS = [
  { id: 'zh001', pattern: '不是[^，。]+而是', severity: 'high', desc: '"不是...而是..."句式' },
  { id: 'zh004', pattern: '简单[一来]说', severity: 'high', desc: '"简单来说"' },
  { id: 'zh006', pattern: '总[的而]言之', severity: 'high', desc: '"总而言之"' },
  { id: 'zh007', pattern: '综上所述', severity: 'high', desc: '"综上所述"' },
  { id: 'zh008', pattern: '值得注意的是', severity: 'high', desc: '"值得注意的是"' },
  { id: 'zh009', pattern: '需要[指强]调的是', severity: 'high', desc: '"需要指出的是"' },
  { id: 'zh011', pattern: '让我[们来]深入', severity: 'high', desc: '"让我们深入探讨"' },
  { id: 'zh015', pattern: '兜住', severity: 'high', desc: '"兜住"' },
  { id: 'zh016', pattern: '接住', severity: 'high', desc: '"接住"' },
  { id: 'zh022', pattern: '这不仅仅是[^，。]+更是', severity: 'high', desc: '"不仅仅是...更是..."' },
  { id: 'en001', pattern: "It'?s worth noting", severity: 'high', desc: '"It\'s worth noting"' },
  { id: 'en002', pattern: '[Ll]et\'?s delve', severity: 'high', desc: '"Let\'s delve into"' },
  { id: 'en003', pattern: '[Ii]n today\'?s (rapidly )?(evolving|changing)', severity: 'high', desc: '"In today\'s rapidly evolving"' },
  { id: 'en008', pattern: '[Ii]n conclusion', severity: 'high', desc: '"In conclusion"' },
  { id: 'en009', pattern: '[Nn]ot [^,.]+ but (rather|instead)', severity: 'high', desc: '"Not X, but Y"' },
  { id: 'en012', pattern: '[Gg]reat question', severity: 'high', desc: '"Great question!"' },
  { id: 'en014', pattern: "I'?d be happy to help", severity: 'high', desc: '"I\'d be happy to help"' },
  { id: 'zh013', pattern: '换句话说', severity: 'medium', desc: '"换句话说"' },
  { id: 'zh024', pattern: '事实上', severity: 'medium', desc: '"事实上"' },
  { id: 'en005', pattern: '[Ff]urthermore', severity: 'medium', desc: '"Furthermore"' },
  { id: 'en006', pattern: '[Mm]oreover', severity: 'medium', desc: '"Moreover"' },
];

function detectPatterns(text: string) {
  const results: { id: string; desc: string; severity: string; count: number }[] = [];
  for (const p of PATTERNS) {
    try {
      const regex = new RegExp(p.pattern, 'g');
      const matches = Array.from(text.matchAll(regex));
      if (matches.length > 0) {
        results.push({ id: p.id, desc: p.desc, severity: p.severity, count: matches.length });
      }
    } catch {
      if (text.includes(p.pattern)) {
        results.push({ id: p.id, desc: p.desc, severity: p.severity, count: 1 });
      }
    }
  }
  return results;
}

function calculateScore(text: string) {
  const detected = detectPatterns(text);
  if (text.length === 0) return 0;
  let score = 0;
  for (const d of detected) {
    score += (d.severity === 'high' ? 15 : 8) * d.count;
  }
  return Math.min(100, Math.round(score / (text.length / 1000) * 2));
}

const SYSTEM_PROMPT = `You are UnAI, an expert writing editor that removes AI-generated writing clichés.

RULES:
- Preserve ALL factual content
- Remove Chinese AI patterns: "不是...而是...", "值得注意的是", "让我们深入探讨", "总而言之", "简单来说", "兜住/接住", "不仅...而且..."
- Remove English AI patterns: "It's worth noting", "Let's delve into", "Furthermore/Moreover", "In conclusion", "Not X but Y", "Great question!", sycophancy
- Keep same language as input
- Make text flow naturally like a human wrote it
- Return ONLY the rewritten text, nothing else`;

export async function POST(req: Request) {
  try {
    const { text, mode = 'balanced' } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    if (text.length > 10000) {
      return NextResponse.json({ error: 'Max 10,000 characters' }, { status: 400 });
    }

    const detected = detectPatterns(text);
    const originalScore = calculateScore(text);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const intensity = mode === 'light' ? 'Minimal changes.' : mode === 'aggressive' ? 'Aggressively rewrite.' : 'Balanced.';

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\nIntensity: ' + intensity },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: Math.min(text.length * 2, 4096),
      }),
    });

    const data = await res.json();
    const rewritten = data.choices?.[0]?.message?.content || text;
    const newScore = calculateScore(rewritten);
    const newDetected = detectPatterns(rewritten);

    return NextResponse.json({
      original: text, rewritten, originalScore, newScore,
      patternsFound: detected.length, patternsRemaining: newDetected.length,
      patterns: detected, mode,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
