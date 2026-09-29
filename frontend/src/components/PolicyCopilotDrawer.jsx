import React, { useState } from 'react';
import { Sparkles, Send, Bot, FileText, CheckCircle2, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function PolicyCopilotDrawer({ selectedDistrict = 'Madurai', onDistrictChange }) {
  const [query, setQuery] = useState('Madurai South-la edhuku budget allocate panna 50k people benefit aavanga?');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const samplePrompts = [
    "Madurai South-la edhuku budget allocate panna 50k people benefit aavanga?",
    "Varanasi Ghats: What is the highest impact sanitation & power project?",
    "Chennai Velachery: Flood mitigation capital outlay plan",
    "BRICS Cross-Border: How can Soweto (South Africa) utilize this DPI?"
  ];

  const handleAsk = async (promptToAsk) => {
    const q = promptToAsk || query;
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/policy-copilot/query'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          district: selectedDistrict
        })
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data);
      }
    } catch (e) {
      console.error('Failed to query Policy Copilot:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid #1a73e8' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Policy Copilot (Gemini 1.5 Flash Agent)</h3>
            <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>
              Grounds queries with data.gov.in census demographics & live citizen demand clusters
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#5f6368', fontWeight: '500' }}>Target Region:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              if (onDistrictChange) onDistrictChange(e.target.value);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #dadce0',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: '#fff'
            }}
          >
            <option value="Madurai">Madurai (Tamil Nadu)</option>
            <option value="Chennai">Chennai (Tamil Nadu)</option>
            <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
            <option value="Bengaluru Urban">Bengaluru (Karnataka)</option>
            <option value="Pune">Pune (Maharashtra)</option>
            <option value="Johannesburg (Soweto)">Johannesburg (BRICS South Africa)</option>
          </select>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(p);
              handleAsk(p);
            }}
            style={{
              background: '#f1f3f4',
              border: '1px solid #dadce0',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              color: '#3c4043',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}
          >
            💡 {p.length > 55 ? p.substring(0, 55) + '...' : p}
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask Policy Copilot: 'Madurai South-la edhuku budget allocate panna 50k people benefit aavanga?'"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #dadce0',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
        <button
          className="btn-primary"
          onClick={() => handleAsk()}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span>Generating Brief...</span>
          ) : (
            <>
              <Send size={15} />
              <span>Ask Agent</span>
            </>
          )}
        </button>
      </div>

      {/* Copilot Response Display */}
      {response && (
        <div style={{
          background: '#f8fafd',
          border: '1px solid #dadce0',
          borderRadius: '10px',
          padding: '1.25rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🏛️ Policy Recommendation & Capital Outlay
            </span>
            <span style={{ fontSize: '0.7rem', color: '#5f6368', background: '#e8f0fe', padding: '2px 8px', borderRadius: '4px' }}>
              {response.generatedBy}
            </span>
          </div>

          <div 
            style={{
              fontSize: '0.875rem',
              color: '#202124',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {response.answer}
          </div>
        </div>
      )}
    </div>
  );
}
