const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Krushi Sahayak, AI farming assistant of Gram Sampan Agro Ltd / Raigad Agro Solution. Help Indian farmers with crops, fertilizers, pest control, irrigation, government schemes (PM-KISAN, subsidies), market prices, organic farming, and Gram Sampan platform usage. Reply in the same language the user writes in (Hindi/Marathi/English/Hinglish). Be friendly, concise, practical. Give actionable advice. Don't make up prices. Keep responses to 2-3 short paragraphs max.`;

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI service not configured.' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const cleanHistory = history.reduce((acc, msg) => {
      const role = msg.role === 'bot' ? 'model' : msg.role;
      if (acc.length === 0 && role !== 'user') return acc;
      acc.push({ role, parts: [{ text: msg.text }] });
      return acc;
    }, []);

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({ success: true, data: { reply: text } });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ success: false, message: 'Sorry, something went wrong. Please try again.' });
  }
};
