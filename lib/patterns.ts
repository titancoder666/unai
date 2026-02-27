// Master pattern database — ChatGPT cliché patterns in Chinese and English
// Sources: 小红书 research, community feedback, manual analysis

export interface Pattern {
  id: string;
  pattern: string;        // The cliché pattern (regex or string)
  category: string;
  language: 'zh' | 'en' | 'both';
  severity: 'high' | 'medium' | 'low';
  description: string;
  alternatives: string[]; // Natural replacement suggestions
}

export const PATTERNS: Pattern[] = [
  // ===== CHINESE PATTERNS (高频AI味) =====
  
  // 对立句式
  { id: 'zh001', pattern: '不是[^，。]+而是', category: '对立句式', language: 'zh', severity: 'high',
    description: '"不是...而是..."句式', alternatives: ['直接陈述后者', '用"其实"引出', '换用"更准确地说"'] },
  { id: 'zh002', pattern: '并不是[^，。]+而是', category: '对立句式', language: 'zh', severity: 'high',
    description: '"并不是...而是..."', alternatives: ['去掉否定，直接说'] },
  { id: 'zh003', pattern: '与其说[^，。]+不如说', category: '对立句式', language: 'zh', severity: 'medium',
    description: '"与其说...不如说..."', alternatives: ['直接表达后者观点'] },

  // 总结排比
  { id: 'zh004', pattern: '简单[一来]说', category: '总结排比', language: 'zh', severity: 'high',
    description: '"简单来说/简单一句话"', alternatives: ['删除，直接说内容'] },
  { id: 'zh005', pattern: '一句话[概总]括', category: '总结排比', language: 'zh', severity: 'high',
    description: '"一句话概括"', alternatives: ['删除'] },
  { id: 'zh006', pattern: '总[的而]言之', category: '总结排比', language: 'zh', severity: 'high',
    description: '"总而言之/总的来说"', alternatives: ['删除或用"所以"', '直接写结论'] },
  { id: 'zh007', pattern: '综上所述', category: '总结排比', language: 'zh', severity: 'high',
    description: '"综上所述"', alternatives: ['删除', '用"回到最初的问题"'] },

  // 缓和语/语用缓冲
  { id: 'zh008', pattern: '值得注意的是', category: '缓和语', language: 'zh', severity: 'high',
    description: '"值得注意的是"', alternatives: ['删除，直接说', '用"另外"'] },
  { id: 'zh009', pattern: '需要[指强]调的是', category: '缓和语', language: 'zh', severity: 'high',
    description: '"需要指出/强调的是"', alternatives: ['删除'] },
  { id: 'zh010', pattern: '不可否认', category: '缓和语', language: 'zh', severity: 'medium',
    description: '"不可否认"', alternatives: ['删除', '用"确实"'] },

  // 元叙述
  { id: 'zh011', pattern: '让我[们来]深入', category: '元叙述', language: 'zh', severity: 'high',
    description: '"让我们深入探讨"', alternatives: ['删除，直接展开分析'] },
  { id: 'zh012', pattern: '接下来[我让]', category: '元叙述', language: 'zh', severity: 'medium',
    description: '"接下来我会..."', alternatives: ['删除，直接写内容'] },
  { id: 'zh013', pattern: '换句话说', category: '元叙述', language: 'zh', severity: 'medium',
    description: '"换句话说"', alternatives: ['删除', '用"也就是"'] },
  { id: 'zh014', pattern: '说白了', category: '元叙述', language: 'zh', severity: 'medium',
    description: '"说白了"口语化压缩', alternatives: ['删除'] },

  // 油腻表达
  { id: 'zh015', pattern: '兜住', category: '油腻表达', language: 'zh', severity: 'high',
    description: '"兜住"', alternatives: ['用"承接""维持"'] },
  { id: 'zh016', pattern: '接住', category: '油腻表达', language: 'zh', severity: 'high',
    description: '"接住"', alternatives: ['用"回应""处理"'] },
  { id: 'zh017', pattern: '收敛', category: '油腻表达', language: 'zh', severity: 'medium',
    description: '"收敛"（非数学语境）', alternatives: ['用"减少""控制"'] },
  { id: 'zh018', pattern: '坍缩', category: '油腻表达', language: 'zh', severity: 'medium',
    description: '"坍缩"（非物理语境）', alternatives: ['用"崩塌""瓦解"'] },
  { id: 'zh019', pattern: '张力', category: '油腻表达', language: 'zh', severity: 'medium',
    description: '"张力"滥用', alternatives: ['用"矛盾""冲突""紧张"'] },

  // 自我修正/情绪声明
  { id: 'zh020', pattern: '我现在可以[冷平]静', category: '自我修正', language: 'zh', severity: 'high',
    description: '模型声明自己的情绪状态', alternatives: ['删除整句'] },
  { id: 'zh021', pattern: '我换个[^，。]*语气', category: '自我修正', language: 'zh', severity: 'high',
    description: '声明要换语气', alternatives: ['删除，直接用新语气'] },

  // 过度副词
  { id: 'zh022', pattern: '这不仅仅是[^，。]+更是', category: '排比递进', language: 'zh', severity: 'high',
    description: '"不仅仅是...更是..."', alternatives: ['分成两句独立表达'] },
  { id: 'zh023', pattern: '不仅[^，。]+而且', category: '排比递进', language: 'zh', severity: 'medium',
    description: '"不仅...而且..."过度使用', alternatives: ['分开说', '用"同时"'] },
  { id: 'zh024', pattern: '事实上', category: '过渡词', language: 'zh', severity: 'medium',
    description: '"事实上"', alternatives: ['删除', '用"其实"'] },
  { id: 'zh025', pattern: '毫无疑问', category: '过渡词', language: 'zh', severity: 'medium',
    description: '"毫无疑问"', alternatives: ['删除'] },

  // 单字词滥用
  { id: 'zh026', pattern: '(?<=[，。])拆(?=[，。开来])', category: '单字词', language: 'zh', severity: 'low',
    description: '单字词"拆"滥用', alternatives: ['拆解', '分析', '拆分'] },
  { id: 'zh027', pattern: '(?<=[，。])搞(?=[，。])', category: '单字词', language: 'zh', severity: 'low',
    description: '单字词"搞"', alternatives: ['做', '进行', '处理'] },

  // ===== ENGLISH PATTERNS =====
  
  // Transitional clichés
  { id: 'en001', pattern: "It'?s worth noting that", category: 'Filler phrases', language: 'en', severity: 'high',
    description: '"It\'s worth noting that"', alternatives: ['Delete entirely', 'Just state the fact'] },
  { id: 'en002', pattern: '[Ll]et\'?s delve into', category: 'Filler phrases', language: 'en', severity: 'high',
    description: '"Let\'s delve into"', alternatives: ['Delete', 'Just start the analysis'] },
  { id: 'en003', pattern: '[Ii]n today\'?s (rapidly )?(evolving|changing)', category: 'Filler phrases', language: 'en', severity: 'high',
    description: '"In today\'s rapidly evolving..."', alternatives: ['Delete', 'Be specific about what changed'] },
  { id: 'en004', pattern: '[Ii]t\'?s important to (note|understand|recognize)', category: 'Filler phrases', language: 'en', severity: 'high',
    description: '"It\'s important to note..."', alternatives: ['Delete, just say it'] },
  { id: 'en005', pattern: '[Ff]urthermore', category: 'Transitions', language: 'en', severity: 'medium',
    description: '"Furthermore" overuse', alternatives: ['Also', 'And', 'Delete'] },
  { id: 'en006', pattern: '[Mm]oreover', category: 'Transitions', language: 'en', severity: 'medium',
    description: '"Moreover"', alternatives: ['Also', 'And', 'On top of that'] },
  { id: 'en007', pattern: '[Hh]owever,? it', category: 'Transitions', language: 'en', severity: 'medium',
    description: '"However" as sentence starter', alternatives: ['But', 'Though', 'That said'] },
  { id: 'en008', pattern: '[Ii]n conclusion', category: 'Summary', language: 'en', severity: 'high',
    description: '"In conclusion"', alternatives: ['Delete', 'So', 'The takeaway'] },
  
  // Structure clichés
  { id: 'en009', pattern: '[Nn]ot [^,.]+ but (rather|instead)', category: 'Contrast structure', language: 'en', severity: 'high',
    description: '"Not X, but Y" structure', alternatives: ['State Y directly', 'Use "actually"'] },
  { id: 'en010', pattern: '[Ww]hile [^,.]+ (it\'?s|this|there)', category: 'Hedging', language: 'en', severity: 'medium',
    description: '"While X, it\'s Y" hedge', alternatives: ['Make two direct sentences'] },
  { id: 'en011', pattern: '[Tt]his is not just [^,.]+ (this is|it\'?s)', category: 'Contrast structure', language: 'en', severity: 'high',
    description: '"This is not just X, it\'s Y"', alternatives: ['State what it IS'] },

  // Sycophantic/filler
  { id: 'en012', pattern: '[Gg]reat question', category: 'Sycophancy', language: 'en', severity: 'high',
    description: '"Great question!"', alternatives: ['Delete entirely'] },
  { id: 'en013', pattern: '[Aa]bsolutely[!.]', category: 'Sycophancy', language: 'en', severity: 'high',
    description: '"Absolutely!"', alternatives: ['Delete', 'Yes'] },
  { id: 'en014', pattern: 'I\'?d be happy to help', category: 'Sycophancy', language: 'en', severity: 'high',
    description: '"I\'d be happy to help"', alternatives: ['Delete, just help'] },
  { id: 'en015', pattern: '[Tt]hat\'?s a (great|excellent|fantastic)', category: 'Sycophancy', language: 'en', severity: 'high',
    description: '"That\'s a great..."', alternatives: ['Delete'] },

  // Em dash / formatting
  { id: 'en016', pattern: '— [a-z]', category: 'Formatting', language: 'en', severity: 'low',
    description: 'Overuse of em dashes', alternatives: ['Use commas or periods', 'Restructure sentence'] },

  // Hedging
  { id: 'en017', pattern: '[Ii]t\'?s worth mentioning', category: 'Hedging', language: 'en', severity: 'high',
    description: '"It\'s worth mentioning"', alternatives: ['Delete'] },
  { id: 'en018', pattern: '[Ii]nterestingly', category: 'Hedging', language: 'en', severity: 'medium',
    description: '"Interestingly,"', alternatives: ['Delete', 'Let the reader decide if it\'s interesting'] },
  { id: 'en019', pattern: '[Aa]s we( can)? see', category: 'Hedging', language: 'en', severity: 'medium',
    description: '"As we can see"', alternatives: ['Delete'] },
  { id: 'en020', pattern: '[Uu]ltimately', category: 'Summary', language: 'en', severity: 'medium',
    description: '"Ultimately"', alternatives: ['Delete', 'So'] },

  // Passive/wordy
  { id: 'en021', pattern: '[Ii]t is (important|crucial|essential|vital) to', category: 'Wordy', language: 'en', severity: 'medium',
    description: '"It is important/crucial to..."', alternatives: ['Delete, just state what to do'] },
  { id: 'en022', pattern: '[Ii]n the realm of', category: 'Wordy', language: 'en', severity: 'high',
    description: '"In the realm of"', alternatives: ['In', 'For', 'Delete'] },
  { id: 'en023', pattern: '[Ll]et me (explain|break)', category: 'Meta-narration', language: 'en', severity: 'medium',
    description: '"Let me explain/break down"', alternatives: ['Delete, just explain'] },
  { id: 'en024', pattern: '[Hh]ere\'?s the (thing|deal|catch)', category: 'Colloquial', language: 'en', severity: 'medium',
    description: '"Here\'s the thing"', alternatives: ['Delete'] },
  { id: 'en025', pattern: '[Aa]t the end of the day', category: 'Cliché', language: 'en', severity: 'high',
    description: '"At the end of the day"', alternatives: ['Delete', 'So'] },
];

// Quick detection: count how many patterns match in a text
export function detectPatterns(text: string): { pattern: Pattern; matches: RegExpMatchArray[] }[] {
  const results: { pattern: Pattern; matches: RegExpMatchArray[] }[] = [];
  for (const p of PATTERNS) {
    try {
      const regex = new RegExp(p.pattern, 'g');
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        results.push({ pattern: p, matches });
      }
    } catch {
      // Simple string match fallback
      if (text.includes(p.pattern)) {
        results.push({ pattern: p, matches: [] });
      }
    }
  }
  return results;
}

// Calculate AI-ness score (0-100)
export function calculateAIScore(text: string): number {
  const detected = detectPatterns(text);
  const chars = text.length;
  if (chars === 0) return 0;
  
  let score = 0;
  for (const d of detected) {
    const weight = d.pattern.severity === 'high' ? 15 : d.pattern.severity === 'medium' ? 8 : 3;
    const matchCount = Math.max(d.matches.length, 1);
    score += weight * matchCount;
  }
  
  // Normalize: more patterns per 1000 chars = higher score
  const normalized = Math.min(100, Math.round(score / (chars / 1000) * 2));
  return normalized;
}
