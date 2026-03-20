export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { company, date, type, location, clientAtt, ourAtt, purpose, discussion, action } = req.body;
  const prompt = `MTI ECO INNOVATION 기술영업본부 ${type} 작성.\n\n[미팅 정보]\n고객사: ${company}\n일자: ${date}${location ? '\n장소: ' + location : ''}\n고객 참석자: ${clientAtt || '미기재'}\n자사 참석자: ${ourAtt || '미기재'}\n미팅 목적: ${purpose}\n주요 논의: ${discussion}\n액션 아이템: ${action || '미기재'}\n\n[요구사항] 격식체, 전문 어휘, 마크다운 없이 일반 텍스트. 섹션: 1.보고개요 2.미팅목적 3.주요논의내용 4.고객요청사항 5.향후조치계획 6.종합의견`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': process.env.ANTHROPIC_API_KEY },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('응답이 비어있습니다.');
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
