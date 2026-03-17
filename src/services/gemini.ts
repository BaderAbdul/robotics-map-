// src/services/gemini.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

export const fetchGeminiWithRetry = async (prompt: string, systemInstruction: string = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  }; 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return `[تفاصيل العطل من جوجل]: ${errorData.error?.message || "خطأ غير معروف في السيرفر"}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من صياغة إجابة.";
  } catch (error: any) {
    return `[عطل في الشبكة أو المتصفح]: ${error.message}`;
  }
};