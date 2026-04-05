import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader } from "lucide-react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const SYSTEM_CONTEXT = `You are BloodCare Assistant, a helpful chatbot for the BloodCare blood donation platform. You help users with blood donation FAQs (eligibility, process, benefits, safety), blood group compatibility, how to use BloodCare (register as donor, search donors, chat feature), general health tips related to blood donation, and emergency blood request guidance. Keep responses concise, warm, and helpful. Use simple formatting. If asked about unrelated topics, politely redirect to blood donation topics.`;

const SUGGESTIONS = [
  "Who can donate blood?",
  "What blood groups are compatible?",
  "How do I register as a donor?",
  "How often can I donate?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I am the BloodCare Assistant.\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  // history for multi-turn conversation
  const historyRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setLoading(true);

    // build conversation history for context
    const contents = [
      // inject system context as first user turn
      { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
      { role: "model", parts: [{ text: "Understood! I am ready to help BloodCare users." }] },
      ...historyRef.current,
      { role: "user", parts: [{ text: msg }] },
    ];

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Gemini API error:", res.status, err);
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not get a response.";

      // update history
      historyRef.current = [
        ...historyRef.current,
        { role: "user", parts: [{ text: msg }] },
        { role: "model", parts: [{ text: reply }] },
      ];

      setMessages((p) => [...p, { role: "bot", text: reply }]);
      if (!open) setUnread((n) => n + 1);
    } catch (err) {
      console.error("Gemini error:", err);
      const msg = err.message?.includes("429")
        ? "Too many requests. Please wait a moment and try again."
        : "Sorry, something went wrong. Please try again.";
      setMessages((p) => [...p, { role: "bot", text: msg }]);
    } finally {
      setLoading(false);
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const fmt = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-all hover:scale-110 active:scale-95"
        title="BloodCare Assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200" style={{ maxHeight: "520px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">BloodCare Assistant</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                <span className="text-[11px] text-red-100">Powered by Gemini AI</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-red-50/50 to-white" style={{ minHeight: "300px", maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0 mt-auto shadow-sm">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                }`}>
                  {fmt(msg.text)}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-auto">
                    <User size={13} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-white border-t border-gray-50 pt-2 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-[11px] bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full hover:bg-red-100 transition font-medium">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:opacity-50"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-full flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition disabled:opacity-40 shadow-md shrink-0"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
