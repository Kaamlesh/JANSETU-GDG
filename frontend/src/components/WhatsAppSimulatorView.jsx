import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, CheckCheck, Phone, Video, MoreVertical, Sparkles, Code2 } from 'lucide-react';

export default function WhatsAppSimulatorView() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: '10:00 AM',
      text: `🙏 வணக்கம்! Welcome to *JanDrishti AI* (National Civic Grievance DPI Bot).

நீங்கள் தமிழ், Hindi, English, அல்லது Tanglish-ல் Voice Note, Photo, அல்லது Text அனுப்பலாம்.

How to report:
1️⃣ Send an audio voice note describing the issue.
2️⃣ Or send a photo of the damaged road/pipe.
3️⃣ Or type your complaint directly.`
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastWebhookPayload, setLastWebhookPayload] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async ({ text, messageType = 'text', mediaUrl = '', language = 'ta' }) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text || (messageType === 'audio' ? '🎙️ [Voice Note: 0:14s]' : '📷 [Attached Photo]'),
      mediaUrl
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/whatsapp/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '+91 94421 88392',
          messageType,
          text: text || (messageType === 'audio' ? 'ரோடு ஃபுல்லா பெரிய பள்ளமா இருக்கு, தண்ணி தேங்கி வண்டி போக முடியல' : 'Broken water pipe causing road crater'),
          mediaUrl,
          language
        })
      });

      const data = await res.json();
      setLastWebhookPayload(data);

      if (data.success) {
        const botReplyMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.botReply,
          ticketId: data.ticketId
        };
        setMessages(prev => [...prev, botReplyMsg]);
      }
    } catch (e) {
      console.error('WhatsApp simulation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSend = () => {
    if (!inputVal.trim()) return;
    sendMessage({ text: inputVal, messageType: 'text', language: 'ta' });
    setInputVal('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#202124' }}>
            Zero-App-Fatigue: WhatsApp Business Bot Live Ingestion
          </h1>
          <span style={{
            background: '#e6f4ea',
            color: '#137333',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '999px'
          }}>
            Meta Webhook Live
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
          Citizens do not need to download new apps. They can send a regional voice note or damage photo directly on WhatsApp.
        </p>
      </div>

      {/* Simulator Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* WhatsApp Mobile Frame */}
        <div className="wa-chat-window">
          {/* Header */}
          <div style={{ background: '#075e54', color: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#25d366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: '#fff',
                fontSize: '0.85rem'
              }}>
                JD
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>JanDrishti AI (Gov DPI)</div>
                <div style={{ fontSize: '0.7rem', color: '#d9fdd3' }}>Official Citizen Grievance Bot • Online</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', color: '#fff' }}>
              <Phone size={17} />
              <Video size={17} />
              <MoreVertical size={17} />
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={msg.sender === 'user' ? 'wa-bubble-outgoing' : 'wa-bubble-incoming'}
              >
                {msg.mediaUrl && (
                  <img
                    src={msg.mediaUrl}
                    alt="Uploaded media"
                    style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }}
                  />
                )}
                <div style={{ whiteSpace: 'pre-wrap', color: '#111b21' }}>{msg.text}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#667781',
                  textAlign: 'right',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '3px'
                }}>
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck size={14} color="#53bdeb" />}
                </div>
              </div>
            ))}

            {loading && (
              <div className="wa-bubble-incoming" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f6368' }}>
                <span className="audio-bar" style={{ height: '14px' }}></span>
                <span className="audio-bar" style={{ height: '20px' }}></span>
                <span style={{ fontSize: '0.75rem' }}>Gemini AI analyzing audio & fusing census data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div style={{ background: '#f0f2f5', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSend()}
              placeholder="Type in Tamil, Hindi, or Tanglish..."
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCustomSend}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#075e54',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Action Simulator Controls & Webhook Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick Simulation Buttons */}
          <div className="google-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#1a73e8" />
              <span>1-Click Test Scenarios for Judges</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#5f6368', marginBottom: '1rem' }}>
              Click any scenario below to trigger an incoming message payload into the webhook pipeline:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn-secondary"
                onClick={() => sendMessage({
                  messageType: 'audio',
                  language: 'ta',
                  text: 'ரோடு ஃபுல்லா பெரிய பள்ளமா இருக்கு, தண்ணி தேங்கி வண்டி போக முடியல'
                })}
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <Mic size={16} color="#ea4335" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>1. Send Tamil Voice Note (Road & Water)</div>
                  <div style={{ fontSize: '0.7rem', color: '#5f6368' }}>"ரோடு ஃபுல்லா பெரிய பள்ளமா இருக்கு..."</div>
                </div>
              </button>

              <button
                className="btn-secondary"
                onClick={() => sendMessage({
                  messageType: 'image',
                  language: 'ta',
                  mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop',
                  text: 'Simmakkal signal pothole with broken pipeline'
                })}
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <Image size={16} color="#1a73e8" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>2. Send Multimodal Photo Inspection</div>
                  <div style={{ fontSize: '0.7rem', color: '#5f6368' }}>Uploads pothole photo & invokes Gemini Vision</div>
                </div>
              </button>

              <button
                className="btn-secondary"
                onClick={() => sendMessage({
                  messageType: 'text',
                  language: 'tanglish',
                  text: 'Velachery main road-la drain block aagi full water stagnation, school bus slip aaiduchu please fix.'
                })}
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <span>✍️</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>3. Send Tanglish Grievance (Chennai)</div>
                  <div style={{ fontSize: '0.7rem', color: '#5f6368' }}>"Velachery main road-la drain block..."</div>
                </div>
              </button>

              <button
                className="btn-secondary"
                onClick={() => sendMessage({
                  messageType: 'text',
                  language: 'hi',
                  text: 'दशाश्वमेध घाट मुख्य मार्ग पर ट्रांसफार्मर से चिंगारी निकल रही है और कचरा फैला है।'
                })}
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <span>🇮🇳</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>4. Send Hindi Grievance (Varanasi Ghats)</div>
                  <div style={{ fontSize: '0.7rem', color: '#5f6368' }}>"दशाश्वमेध घाट मुख्य मार्ग पर ट्रांसफार्मर..."</div>
                </div>
              </button>
            </div>
          </div>

          {/* Real-time Webhook Inspector */}
          {lastWebhookPayload && (
            <div className="google-card" style={{ background: '#202124', color: '#e8eaed', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#8ab4f8' }}>
                  <Code2 size={16} />
                  <span>Real-Time Webhook & Data Fusion Payload</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#9aa0a6' }}>
                  Status: 200 OK
                </span>
              </div>

              <pre style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                background: '#16171d',
                padding: '10px',
                borderRadius: '6px',
                overflowX: 'auto',
                maxHeight: '180px',
                color: '#81c995'
              }}>
                {JSON.stringify({
                  ticketId: lastWebhookPayload.ticketId,
                  calculatedPriority: lastWebhookPayload.fusionData?.calculatedPriority,
                  priorityTier: lastWebhookPayload.fusionData?.priorityTier,
                  formulaBreakdown: lastWebhookPayload.fusionData?.formulaBreakdown,
                  bigQueryTable: lastWebhookPayload.fusionData?.bigQueryTableSync
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
