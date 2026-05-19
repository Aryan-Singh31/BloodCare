import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiX, FiSend, FiMinus } from 'react-icons/fi';
import './AIChatbot.css';

const API = import.meta.env.VITE_API_URL || '/api';

const QUICK_QUESTIONS = [
  'What blood types are compatible?',
  'How to prepare for donation?',
  'Foods to boost hemoglobin?',
  'How often can I donate?',
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm BloodCare AI 🩸\nI can help with blood donation, compatibility, health tips, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1, -1).map(m => ({ role: m.role, content: m.content }));
      const { data } = await axios.post(`${API}/ai/chat`, {
        message: userMsg,
        history,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button className="chatbot-fab" onClick={() => setOpen(true)}>
          <span className="fab-icon">🤖</span>
          <span className="fab-label">AI Assistant</span>
          <span className="fab-pulse" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`chatbot-window ${minimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-name">BloodCare AI</div>
                <div className="chatbot-status">
                  <span className="status-dot" />
                  Always active
                </div>
              </div>
            </div>
            <div className="chatbot-controls">
              <button onClick={() => setMinimized(!minimized)}>
                <FiMinus size={16} />
              </button>
              <button onClick={() => setOpen(false)}>
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="msg-avatar">🤖</div>
                    )}
                    <div className="msg-bubble">
                      {msg.content.split('\n').map((line, j) => (
                        <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                      ))}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="chat-msg assistant">
                    <div className="msg-avatar">🤖</div>
                    <div className="msg-bubble typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              {messages.length === 1 && (
                <div className="quick-questions">
                  {QUICK_QUESTIONS.map(q => (
                    <button key={q} className="quick-q" onClick={() => sendMessage(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="chatbot-input">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask anything about blood health..."
                  className="chat-input"
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
