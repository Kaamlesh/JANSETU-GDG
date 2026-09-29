import React from 'react';
import { 
  Layers, Database, Sparkles, Globe, DollarSign, 
  ShieldCheck, Cpu, ArrowRight, CheckCircle2, TrendingUp 
} from 'lucide-react';

export default function BlueprintView() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#202124' }}>
            JanDrishti AI: Digital Public Infrastructure & Business Blueprint
          </h1>
          <span style={{
            background: '#e8f0fe',
            color: '#1a73e8',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '999px'
          }}>
            Track 1: BRICS Innovation
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
          Architectural specification, Google AI integration matrix, and B2G GovTech monetization strategy.
        </p>
      </div>

      {/* 5-Layer End-to-End Architecture */}
      <div className="google-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="#1a73e8" />
          <span>End-to-End System Architecture (5 Core Layers)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          {/* Layer 1 */}
          <div style={{ background: '#f8fafd', border: '1px solid #dadce0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#1a73e8' }}>LAYER 01</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Citizen Ingestion</h3>
            <p style={{ fontSize: '0.78rem', color: '#5f6368' }}>
              WhatsApp Business Bot, Telegram, Web App, & IVR phone stream. Regional voice notes (Tamil, Hindi, Telugu, Tanglish) with zero app download friction.
            </p>
          </div>

          {/* Layer 2 */}
          <div style={{ background: '#f8fafd', border: '1px solid #dadce0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ea4335' }}>LAYER 02</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Google AI Processing</h3>
            <p style={{ fontSize: '0.78rem', color: '#5f6368' }}>
              Gemini 1.5/2.5 Flash Multimodal Vision verifies physical road craters and waterlogging. NLP handles sentiment analysis, urgency classification, and translation.
            </p>
          </div>

          {/* Layer 3 */}
          <div style={{ background: '#f8fafd', border: '1px solid #dadce0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#34a853' }}>LAYER 03</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Spatial Data Fusion</h3>
            <p style={{ fontSize: '0.78rem', color: '#5f6368' }}>
              BigQuery joins ingested civic signals with national open datasets from data.gov.in (Census 2021, BPL demographics, and ISRO Bhuvan geospatial layers).
            </p>
          </div>

          {/* Layer 4 */}
          <div style={{ background: '#f8fafd', border: '1px solid #dadce0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#f9ab00' }}>LAYER 04</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Predictive Prioritization</h3>
            <p style={{ fontSize: '0.78rem', color: '#5f6368' }}>
              Calculates Priority Index = w1(Density) + w2(Vulnerability) - w3(Infra Deficit) + Vision Boosters, preventing misallocated public capital expenditure.
            </p>
          </div>

          {/* Layer 5 */}
          <div style={{ background: '#f8fafd', border: '1px solid #dadce0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9334e8' }}>LAYER 05</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Policymaker Decision Hub</h3>
            <p style={{ fontSize: '0.78rem', color: '#5f6368' }}>
              Interactive GIS heatmaps and "Policy Copilot" Gemini Agent generating immediate capital allocation plans, multi-scheme funding options, and 60-day roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Google Tech Stack & Free-Tier Optimization */}
      <div className="google-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#1a73e8" />
          <span>Google AI & Cloud Services Evaluation Matrix</span>
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dadce0', color: '#5f6368', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <th style={{ padding: '8px 12px' }}>Google Service</th>
                <th style={{ padding: '8px 12px' }}>Use Case in JanDrishti</th>
                <th style={{ padding: '8px 12px' }}>Free Tier / Pricing Status</th>
                <th style={{ padding: '8px 12px' }}>Implementation Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e0e3e7' }}>
                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#1a73e8' }}>Gemini 1.5 / 2.5 Flash</td>
                <td style={{ padding: '10px 12px' }}>Civic categorization, sentiment, Policy Copilot agent</td>
                <td style={{ padding: '10px 12px', color: '#137333', fontWeight: '600' }}>100% Free (Google AI Studio 15 RPM)</td>
                <td style={{ padding: '10px 12px' }}>Official @google/generative-ai SDK in Node.js backend</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e3e7' }}>
                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#ea4335' }}>Gemini Multimodal Vision</td>
                <td style={{ padding: '10px 12px' }}>Pothole, cracked pipe, waterlogging inspection</td>
                <td style={{ padding: '10px 12px', color: '#137333', fontWeight: '600' }}>Free under standard Gemini token limits</td>
                <td style={{ padding: '10px 12px' }}>Direct base64 image buffer inspection</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e3e7' }}>
                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#34a853' }}>Cloud Speech-to-Text</td>
                <td style={{ padding: '10px 12px' }}>Transcribing vernacular voice notes (Tamil/Hindi)</td>
                <td style={{ padding: '10px 12px', color: '#137333', fontWeight: '600' }}>60 Mins/month Free (V1 API) + Browser Web Speech</td>
                <td style={{ padding: '10px 12px' }}>Zero-cost browser Web Speech API for web demo</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e3e7' }}>
                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#f9ab00' }}>BigQuery / Vertex AI</td>
                <td style={{ padding: '10px 12px' }}>National census data fusion & spatial predictive ranking</td>
                <td style={{ padding: '10px 12px', color: '#137333', fontWeight: '600' }}>10 GB storage & 1 TB query analysis free/month</td>
                <td style={{ padding: '10px 12px' }}>Pre-processed census SQL layers in backend data engine</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Model & Profitability (B2G SaaS) */}
      <div className="google-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={20} color="#137333" />
          <span>Market Potential & B2G Revenue Model</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1a73e8', marginBottom: '4px' }}>
              1. GovTech SaaS Subscriptions
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>
              State Municipal Corporations and Smart City SPVs license JanDrishti as their centralized capital allocation dashboard (₹25L – ₹1.2 Cr annual contract per Tier-1/2 city).
            </p>
          </div>

          <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ea4335', marginBottom: '4px' }}>
              2. Multilateral Grant Advisory (World Bank / ADB)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>
              International development banks require verified ground-level demand data before disbursing urban infrastructure loans. JanDrishti provides verifiable audit feeds.
            </p>
          </div>

          <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#34a853', marginBottom: '4px' }}>
              3. CSR Capital Optimization
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>
              Large corporate CSR foundations (Tata, Reliance) subscribe to target high-vulnerability wards with maximum social ROI for water and school infrastructure.
            </p>
          </div>

          <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f9ab00', marginBottom: '4px' }}>
              4. BRICS Cross-Border Scalability
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>
              The core Digital Public Good architecture seamlessly translates to South Africa (e.g. Soweto sanitation) and Brazil (favela infrastructure) with localized language packs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
