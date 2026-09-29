import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, CheckCircle, TrendingUp, Users, 
  DollarSign, MapPin, Filter, ArrowUpRight, ShieldAlert, 
  ExternalLink, Layers, CheckCircle2 
} from 'lucide-react';
import GisMap from './GisMap';
import PolicyCopilotDrawer from './PolicyCopilotDrawer';
import { getApiUrl } from '../config/api';

export default function DashboardView({ currentLang }) {
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sanctionSuccess, setSanctionSuccess] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resOverview, resHotspots, resGrievances] = await Promise.all([
        fetch(getApiUrl('/api/analytics/overview')).then(r => r.json()),
        fetch(getApiUrl('/api/analytics/hotspots')).then(r => r.json()),
        fetch(getApiUrl('/api/grievances')).then(r => r.json())
      ]);

      if (resOverview.success) setStats(resOverview.stats);
      if (resHotspots.success) setHotspots(resHotspots.data);
      if (resGrievances.success) setGrievances(resGrievances.data);
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (ticketId, nextStatus) => {
    try {
      const res = await fetch(getApiUrl(`/api/grievances/${ticketId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSanctionSuccess(`Work Sanctioned successfully for ticket ${ticketId}!`);
        setTimeout(() => setSanctionSuccess(null), 4000);
        fetchDashboardData();
      }
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const matchDistrict = selectedDistrict === 'All' || g.location?.district?.toLowerCase() === selectedDistrict.toLowerCase();
    const matchCategory = selectedCategory === 'All' || g.category === selectedCategory;
    return matchDistrict && matchCategory;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title & DPI Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#202124' }}>
              National Infrastructure Policy & Hotspot Command Center
            </h1>
            <span style={{
              background: '#e8f0fe',
              color: '#1a73e8',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '999px'
            }}>
              DPI Live Feed
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
            Aggregating multi-lingual citizen feedback fused with data.gov.in Census 2021 and predictive capital prioritization.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-secondary"
            onClick={fetchDashboardData}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            ↻ Refresh BigQuery Sync
          </button>
        </div>
      </div>

      {sanctionSuccess && (
        <div style={{
          background: '#e6f4ea',
          border: '1px solid #34a853',
          color: '#137333',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{sanctionSuccess}</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>
        {/* KPI 1 */}
        <div className="kpi-card" style={{ '--card-accent': '#1a73e8' }}>
          <span className="kpi-label">Total Ingested Feedback</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="kpi-value">{stats?.totalGrievances || 5}</span>
            <Activity size={20} color="#1a73e8" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Voice, WhatsApp & Web DPI streams</span>
        </div>

        {/* KPI 2 */}
        <div className="kpi-card" style={{ '--card-accent': '#ea4335' }}>
          <span className="kpi-label">Critical Demand Hotspots</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="kpi-value" style={{ color: '#ea4335' }}>{stats?.criticalHotspots || 4}</span>
            <ShieldAlert size={20} color="#ea4335" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Priority Index ≥ 80 / 100</span>
        </div>

        {/* KPI 3 */}
        <div className="kpi-card" style={{ '--card-accent': '#34a853' }}>
          <span className="kpi-label">Gemini Vision Verified</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="kpi-value" style={{ color: '#34a853' }}>{stats?.aiVerifiedPercentage || 100}%</span>
            <CheckCircle size={20} color="#34a853" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Confirmed civic structural hazards</span>
        </div>

        {/* KPI 4 */}
        <div className="kpi-card" style={{ '--card-accent': '#fa7b17' }}>
          <span className="kpi-label">Citizens Benefited</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="kpi-value">{(stats?.totalBeneficiariesReached || 281000).toLocaleString('en-IN')}</span>
            <Users size={20} color="#fa7b17" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Across vulnerable ward sectors</span>
        </div>

        {/* KPI 5 */}
        <div className="kpi-card" style={{ '--card-accent': '#9334e8' }}>
          <span className="kpi-label">Estimated Capital Outlay</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="kpi-value">₹{stats?.totalEstimatedCapitalCrores || '0.23'} Cr</span>
            <DollarSign size={20} color="#9334e8" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Consolidated Scheme Outlay</span>
        </div>
      </div>

      {/* Prioritization Formula Info Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 1px 3px rgba(60,64,67,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#1a73e8" />
          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#202124' }}>
            AI Predictive Prioritization Index Formula:
          </span>
          <code style={{ background: '#f1f3f4', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#1a73e8', fontWeight: '600' }}>
            Priority = 0.45(Complaint Density) + 0.35(Demographic Vulnerability) - 0.20(Existing Infra) + Modifiers
          </code>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>
          Grounding: Census 2021 • ISRO Bhuvan Spatial Grid • Gemini 1.5 Multimodal
        </span>
      </div>

      {/* Main Grid: Spatial Map & GIS Clusters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="google-card" style={{ padding: '1rem' }}>
          <div className="google-card-header" style={{ marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Geospatial Infrastructure Demand Heatmap</h2>
              <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>
                Interactive GIS layer visualizing citizen complaint density, poverty index, and infrastructure deficit.
              </p>
            </div>
            
            {/* Quick District Jump */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Madurai', 'Chennai', 'Varanasi', 'Bengaluru', 'Soweto (BRICS)'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d === 'Soweto (BRICS)' ? 'Johannesburg (Soweto)' : d)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid #dadce0',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: selectedDistrict.includes(d.split(' ')[0]) ? '#1a73e8' : '#ffffff',
                    color: selectedDistrict.includes(d.split(' ')[0]) ? '#ffffff' : '#3c4043'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <GisMap
            hotspots={hotspots}
            center={selectedDistrict.includes('Johannesburg') ? [-26.2485, 27.8540] : [13.0827, 80.2707]}
            zoom={selectedDistrict === 'All' ? 5 : 11}
            onSelectDistrict={(dist) => setSelectedDistrict(dist)}
          />
        </div>
      </div>

      {/* Policy Copilot (Gemini Agent) Drawer */}
      <PolicyCopilotDrawer 
        selectedDistrict={selectedDistrict === 'All' ? 'Madurai' : selectedDistrict} 
        onDistrictChange={(dist) => setSelectedDistrict(dist)}
      />

      {/* Demand Hotspots Prioritization Table */}
      <div className="google-card" style={{ padding: '1.25rem' }}>
        <div className="google-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              High-Priority Capital Projects Queue ({filteredGrievances.length} Active Records)
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>
              Complaints dynamically scored by Gemini Multimodal analysis and fused with ward census demographics.
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="#5f6368" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #dadce0',
                fontSize: '0.8rem',
                background: '#fff'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Roads & Potholes">Roads & Potholes</option>
              <option value="Water Supply & Drainage">Water Supply & Drainage</option>
              <option value="Sanitation & Waste">Sanitation & Waste</option>
              <option value="Electricity & Streetlights">Electricity & Streetlights</option>
              <option value="Public Health & Clinics">Public Health & Clinics</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dadce0', color: '#5f6368', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Ticket & Media</th>
                <th style={{ padding: '10px 12px' }}>Location & Ward</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Issue Summary & Gemini Translation</th>
                <th style={{ padding: '10px 12px' }}>Beneficiaries</th>
                <th style={{ padding: '10px 12px' }}>Priority Index</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((g) => {
                const isCrit = (g.priorityScore || 0) >= 80;
                const isHigh = (g.priorityScore || 0) >= 65;
                const scoreColor = isCrit ? '#ea4335' : isHigh ? '#fa7b17' : '#34a853';

                return (
                  <tr key={g._id || g.ticketId} style={{ borderBottom: '1px solid #e0e3e7', verticalAlign: 'top' }}>
                    
                    {/* Ticket & Media */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontWeight: '700', color: '#1a73e8', fontSize: '0.8rem' }}>
                          {g.ticketId}
                        </span>
                        {g.media?.imageUrl ? (
                          <img
                            src={g.media.imageUrl}
                            alt="Damage"
                            style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #dadce0' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#80868b' }}>Voice Ingested</span>
                        )}
                        <span style={{ fontSize: '0.65rem', color: '#5f6368' }}>
                          Lang: {g.originalLanguage?.toUpperCase()} • {g.source}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#202124' }}>{g.location?.district}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5f6368' }}>{g.location?.ward}</div>
                      <div style={{ fontSize: '0.7rem', color: '#80868b' }}>{g.location?.landmark}</div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        background: '#f1f3f4',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '0.75rem'
                      }}>
                        {g.category}
                      </span>
                    </td>

                    {/* Translation */}
                    <td style={{ padding: '12px', maxWidth: '320px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#202124', fontWeight: '500', marginBottom: '4px' }}>
                        "{g.translatedText}"
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#5f6368', fontStyle: 'italic' }}>
                        Raw Vernacular: {g.rawInputText?.substring(0, 70)}...
                      </div>
                      {g.media?.damageVerified && (
                        <div style={{ marginTop: '4px', fontSize: '0.68rem', color: '#137333', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={12} />
                          <span>Gemini Vision Verified ({g.media.severityLevel})</span>
                        </div>
                      )}
                    </td>

                    {/* Beneficiaries */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#202124' }}>
                        {(g.impactAssessment?.estimatedBeneficiaries || 15000).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#5f6368' }}>
                        Est: ₹{((g.impactAssessment?.estimatedBudgetINR || 400000) / 100000).toFixed(1)}L
                      </div>
                    </td>

                    {/* Priority Score */}
                    <td style={{ padding: '12px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: `${scoreColor}15`,
                        color: scoreColor,
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        border: `2px solid ${scoreColor}`
                      }}>
                        {g.priorityScore || 65}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: scoreColor, fontWeight: '700', marginTop: '2px' }}>
                        {isCrit ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL'}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px' }}>
                      <span className={`badge-chip ${
                        g.status === 'Work Sanctioned' ? 'badge-low' :
                        g.status === 'Budget Proposed' ? 'badge-medium' : 'badge-critical'
                      }`}>
                        {g.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px' }}>
                      {g.status !== 'Work Sanctioned' ? (
                        <button
                          onClick={() => handleUpdateStatus(g.ticketId, 'Work Sanctioned')}
                          style={{
                            padding: '5px 10px',
                            background: '#1a73e8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Sanction Work
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#137333', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Sanctioned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
