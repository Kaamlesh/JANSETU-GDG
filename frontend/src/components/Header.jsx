import React from 'react';
import { ShieldCheck, Globe, Activity, MessageSquare, MapPin, Sparkles, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Header({ activeTab, setActiveTab, currentLang, setCurrentLang, backendHealthy }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const languages = [
    { code: 'en', label: 'English (Default)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' }
  ];

  return (
    <header className="google-appbar">
      <div className="google-appbar-inner">
        {/* Brand */}
        <div className="google-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 50%, #f9ab00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(26,115,232,0.3)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.1rem'
            }}>
              JD
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="brand-title" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#202124' }}>
                  {t.brandName}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  background: '#e8f0fe',
                  color: '#1a73e8',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  DPI • BRICS
                </span>
              </div>
              <p style={{ fontSize: '0.725rem', color: '#5f6368', fontWeight: '500' }}>
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className={`nav-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={17} />
            <span>{t.navPolicymaker}</span>
          </button>

          <button 
            className={`nav-tab-button ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            <Sparkles size={17} />
            <span>{t.navCitizen}</span>
          </button>

          <button 
            className={`nav-tab-button ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <MessageSquare size={17} />
            <span>{t.navWhatsApp}</span>
          </button>

          <button 
            className={`nav-tab-button ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Layers size={17} />
            <span>{t.navArchitecture}</span>
          </button>
        </nav>

        {/* Right Section: Language Picker & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: backendHealthy ? '#e6f4ea' : '#fce8e6',
            color: backendHealthy ? '#137333' : '#c5221f',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendHealthy ? '#34a853' : '#ea4335',
              display: 'inline-block'
            }} />
            <span>{backendHealthy ? 'Gemini 1.5 Flash Connected' : 'Engine Ready'}</span>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} color="#5f6368" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #dadce0',
                background: '#fff',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#202124',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
