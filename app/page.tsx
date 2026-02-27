'use client';

import { useState, useRef } from 'react';

interface PatternMatch {
  id: string;
  pattern: string;
  category: string;
  severity: string;
  count: number;
}

interface RewriteResult {
  original: string;
  rewritten: string;
  originalScore: number;
  newScore: number;
  patternsFound: number;
  patternsRemaining: number;
  patterns: PatternMatch[];
  mode: string;
}

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'light' | 'balanced' | 'aggressive'>('balanced');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRewrite = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const severityColor = (s: string) =>
    s === 'high' ? 'text-red-400' : s === 'medium' ? 'text-yellow-400' : 'text-gray-400';

  const scoreColor = (score: number) =>
    score >= 70 ? 'text-red-400' : score >= 40 ? 'text-yellow-400' : 'text-green-400';

  const DEMO_ZH = `值得注意的是，在今天快速发展的AI领域中，这不仅仅是一个技术问题，更是一个关于人类未来的深刻议题。让我们深入探讨这个话题。

事实上，ChatGPT的写作模式不是简单的文字生成，而是一种复杂的语言模型运作。简单来说，它会倾向于使用特定的句式和表达方式。

总而言之，我们需要认识到AI写作的局限性，不仅要关注其能力，而且要关注其带来的潜在风险。毫无疑问，这是一个值得我们深思的问题。`;

  const DEMO_EN = `It's worth noting that in today's rapidly evolving landscape of artificial intelligence, this is not just a technological challenge, but a profound question about the future of humanity. Let's delve into this topic.

Furthermore, it's important to understand that ChatGPT's writing patterns are not simply text generation, but rather a complex language model operation. Moreover, it tends to favor specific sentence structures and expressions.

In conclusion, we need to recognize the limitations of AI writing. This is not just about its capabilities, but also about the potential risks it brings. Ultimately, this is a question that deserves our careful consideration.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            UnAI
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-1">去除AI写作痕迹 · Remove AI Writing Patterns</p>
        <p className="text-sm text-gray-500">让AI写的文字像人写的一样自然 / Make AI text sound human</p>
      </div>

      {/* Mode selector */}
      <div className="flex justify-center gap-3 mb-6">
        {(['light', 'balanced', 'aggressive'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {m === 'light' ? '🌿 轻度 Light' : m === 'balanced' ? '⚖️ 均衡 Balanced' : '🔥 强力 Aggressive'}
          </button>
        ))}
      </div>

      {/* Demo buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setText(DEMO_ZH)}
          className="text-xs text-purple-400 hover:text-purple-300 underline"
        >
          📝 试试中文示例
        </button>
        <button
          onClick={() => setText(DEMO_EN)}
          className="text-xs text-purple-400 hover:text-purple-300 underline"
        >
          📝 Try English demo
        </button>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">粘贴AI生成的文字 / Paste AI-generated text</label>
          <span className="text-xs text-gray-500">{text.length} / 10,000</span>
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在这里粘贴ChatGPT生成的文字...&#10;Paste ChatGPT-generated text here..."
          className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y text-sm leading-relaxed"
          maxLength={10000}
        />
      </div>

      {/* Rewrite button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleRewrite}
          disabled={loading || !text.trim()}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              处理中 Rewriting...
            </span>
          ) : (
            '✨ 去除AI味 / Remove AI Patterns'
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">原文 AI 分数 / Original</p>
              <p className={`text-4xl font-bold ${scoreColor(result.originalScore)}`}>
                {result.originalScore}
              </p>
              <p className="text-xs text-gray-500 mt-1">检测到 {result.patternsFound} 个AI模式</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">改写后 / After UnAI</p>
              <p className={`text-4xl font-bold ${scoreColor(result.newScore)}`}>
                {result.newScore}
              </p>
              <p className="text-xs text-gray-500 mt-1">剩余 {result.patternsRemaining} 个模式</p>
            </div>
          </div>

          {/* Patterns detected */}
          {result.patterns.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-3">🔍 检测到的AI模式 / Detected Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {result.patterns.map((p, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      p.severity === 'high' ? 'border-red-700 bg-red-900/30 text-red-300' :
                      p.severity === 'medium' ? 'border-yellow-700 bg-yellow-900/30 text-yellow-300' :
                      'border-gray-700 bg-gray-800 text-gray-400'
                    }`}
                  >
                    {p.pattern} {p.count > 1 ? `×${p.count}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-red-400 mb-3">❌ 原文 / Original</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.original}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-purple-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-green-400">✅ 改写 / Rewritten</h3>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 复制 Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.rewritten}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-16 text-xs text-gray-600">
        <p>UnAI — Built by 张迈克Michael · Powered by AI, ironically</p>
        <p className="mt-1">支持中文 + English · Free: 5 rewrites/day</p>
      </div>
    </div>
  );
}
