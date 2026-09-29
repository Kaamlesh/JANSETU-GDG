import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import CitizenPortalView from './components/CitizenPortalView';
import WhatsAppSimulatorView from './components/WhatsAppSimulatorView';
import BlueprintView from './components/BlueprintView';
import { getApiUrl } from './config/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentLang, setCurrentLang] = useState('en');
  const [backendHealthy, setBackendHealthy] = useState(true);

  // Periodic health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(getApiUrl('/api/health'));
        const data = await res.json();
        if (data.status === 'healthy') {
          setBackendHealthy(true);
        }
      } catch (e) {
        setBackendHealthy(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Google Product Style App Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        backendHealthy={backendHealthy}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'dashboard' && <DashboardView currentLang={currentLang} />}
        {activeTab === 'citizen' && <CitizenPortalView currentLang={currentLang} />}
        {activeTab === 'whatsapp' && <WhatsAppSimulatorView />}
        {activeTab === 'architecture' && <BlueprintView />}
      </main>

      {/* Google / BRICS Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #dadce0',
        padding: '1.25rem 2rem',
        marginTop: 'auto',
        fontSize: '0.8rem',
        color: '#5f6368',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '700', color: '#202124' }}>JanDrishti AI</span>
          <span>•</span>
          <span>Track 1: AI for Digital Public Infrastructure & Governance (BRICS Innovation)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Powered by Gemini 1.5/2.5 Flash • BigQuery • Google Maps Platform</span>
          <span>•</span>
          <span style={{ color: '#1a73e8', fontWeight: '600' }}>GovTech SaaS Ready</span>
        </div>
      </footer>
    </div>
  );
}
