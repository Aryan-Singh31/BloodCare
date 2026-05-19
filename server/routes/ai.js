const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'AI service not configured' });

    const systemPrompt = `You are BloodCare AI Assistant, a helpful medical assistant specializing in blood donation, blood health, and related topics. 
    You help users understand:
    - Blood types and compatibility
    - Blood donation process and eligibility
    - Blood-related health conditions
    - Nutrition for blood health
    - Finding donors and urgent blood needs
    
    Keep responses concise, friendly, and medically accurate. Always recommend consulting a doctor for serious medical concerns.
    You are integrated into BloodCare - an AI Integrated Donor and Receiver Platform in India.`;

    const contents = [
      ...history.map(h => ({ 
        role: h.role === 'assistant' ? 'model' : 'user', 
        parts: [{ text: h.content }] 
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    // FIX: Using gemini-2.5-flash, the current supported free-tier model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API Error Details:", JSON.stringify(data, null, 2));
        return res.status(response.status).json({ 
            message: data.error?.message || 'The AI service returned an error.' 
        });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not process that request.';
    res.json({ response: text });
    
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;