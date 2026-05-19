import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiSearch, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import './ChatPage.css';

const API = import.meta.env.VITE_API_URL || '/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function ChatPage() {
  const { user, token } = useAuth();
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef();
  const typingTimerRef = useRef();

  // Init socket
  useEffect(() => {
    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    s.on('connect', () => { s.emit('join', user._id); });
    s.on('receiveMessage', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });
    s.on('typing', () => setIsTyping(true));
    s.on('stopTyping', () => setIsTyping(false));
    setSocket(s);
    return () => s.disconnect();
  }, [user._id, token]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get(`${API}/chat/conversations`);
      setConversations(data);
      // If URL has a userId, open that conversation after loading
      if (paramUserId) {
        openConversation(paramUserId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (otherUserId) => {
    try {
      const [convData, userData] = await Promise.all([
        axios.get(`${API}/chat/conversation/${otherUserId}`),
        axios.get(`${API}/auth/user/${otherUserId}`),
      ]);
      const otherUser = userData.data;
      setActiveConv({ conversationId: convData.data.conversationId, otherUserId });
      setMessages(convData.data.messages);
      setConversations(prev => {
        const exists = prev.find(c => c.otherUser?._id === otherUserId);
        if (!exists) {
          return [...prev, {
            conversationId: convData.data.conversationId,
            otherUser,
            lastMessage: null,
            unreadCount: 0,
          }];
        }
        // update with real user data in case it was a placeholder
        return prev.map(c =>
          c.otherUser?._id === otherUserId ? { ...c, otherUser } : c
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvClick = (conv) => {
    openConversation(conv.otherUser?._id);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return;
    const to = activeConv.otherUserId;
    if (!to || to === 'undefined') return;
    socket.emit('sendMessage', {
      to,
      from: user._id,
      message: input.trim(),
      conversationId: activeConv.conversationId,
    });
    setInput('');
    socket.emit('stopTyping', { to });
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (!activeConv) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { to: activeConv.otherUserId, from: user._id });
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('stopTyping', { to: activeConv.otherUserId });
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeConvData = conversations.find(c => c.otherUser?._id?.toString() === activeConv?.otherUserId?.toString());
  const filteredConvs = conversations.filter(c =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="page">
      <Navbar />
      <div className="chat-page">
        {/* Sidebar */}
        <div className={`chat-sidebar ${activeConv ? 'hidden-mobile' : ''}`}>
          <div className="chat-sidebar-header">
            <h2>Messages</h2>
            <div className="chat-search">
              <FiSearch size={14} color="var(--text3)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations"
                className="chat-search-input"
              />
            </div>
          </div>

          <div className="conversations-list">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="conv-skeleton" />
              ))
            ) : filteredConvs.length === 0 ? (
              <div className="chat-empty-sidebar">
                <FiMessageCircle size={32} color="var(--text3)" />
                <p>No conversations yet</p>
                <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  Find a donor and start chatting
                </p>
              </div>
            ) : (
              filteredConvs.map(conv => (
                <div
                  key={conv.conversationId}
                  className={`conv-item ${activeConv?.otherUserId === conv.otherUser?._id ? 'active' : ''}`}
                  onClick={() => handleConvClick(conv)}
                >
                  <div className="conv-avatar">
                    {conv.otherUser?.avatar
                      ? <img src={conv.otherUser.avatar} alt={conv.otherUser.name} />
                      : conv.otherUser?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.otherUser?.name || 'User'}</div>
                    {conv.lastMessage && (
                      <div className="conv-last-msg">
                        {conv.lastMessage.sender?._id === user._id ? 'You: ' : ''}
                        {conv.lastMessage.content?.slice(0, 35)}
                        {conv.lastMessage.content?.length > 35 ? '...' : ''}
                      </div>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="unread-badge">{conv.unreadCount}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`chat-window ${!activeConv ? 'hidden-mobile' : ''}`}>
          {!activeConv ? (
            <div className="chat-no-select">
              <FiMessageCircle size={64} color="var(--text3)" />
              <h3 style={{ marginTop: 16 }}>Select a conversation</h3>
              <p style={{ color: 'var(--text2)', marginTop: 8 }}>
                Or search for a donor and start chatting
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="chat-window-header">
                <button className="back-btn" onClick={() => { setActiveConv(null); navigate('/chat'); }}>
                  <FiArrowLeft />
                </button>
                <div className="chat-user-info">
                  <div className="chat-user-avatar">
                    {activeConvData?.otherUser?.avatar
                      ? <img src={activeConvData.otherUser.avatar} alt="" />
                      : activeConvData?.otherUser?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="chat-user-name">
                      {activeConvData?.otherUser?.name || 'User'}
                    </div>
                    {isTyping && (
                      <div className="typing-indicator">typing...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="date-divider">
                      <span>{formatDate(msgs[0].createdAt)}</span>
                    </div>
                    {msgs.map((msg) => {
                      const isMine = msg.sender?._id === user._id || msg.sender === user._id;
                      return (
                        <div key={msg._id} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                          {!isMine && (
                            <div className="msg-user-avatar">
                              {activeConvData?.otherUser?.avatar
                                ? <img src={activeConvData.otherUser.avatar} alt="" />
                                : activeConvData?.otherUser?.name?.[0] || '?'}
                            </div>
                          )}
                          <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                            <div className="message-text">{msg.content}</div>
                            <div className="message-time">{formatTime(msg.createdAt)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {isTyping && (
                  <div className="message-row theirs">
                    <div className="message-bubble theirs typing-bubble">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <input
                  value={input}
                  onChange={handleInput}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="chat-msg-input"
                />
                <button
                  className="chat-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                >
                  <FiSend size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
