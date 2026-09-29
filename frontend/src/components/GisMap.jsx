import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Users, Layers, TrendingUp } from 'lucide-react';

// Create custom glowing hotspot pin icon
const createHotspotIcon = (score, isCritical) => {
  const color = score >= 80 ? '#ea4335' : score >= 65 ? '#fa7b17' : '#34a853';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${color};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
        ">
          ${score}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function GisMap({ hotspots = [], center = [9.9252, 78.1198], zoom = 6, onSelectDistrict }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #dadce0' }}>
      {/* Legend Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 500,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '8px 14px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ fontWeight: '700', color: '#202124', marginBottom: '2px' }}>Demand Hotspot Priority Index</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea4335' }} />
          <span>Critical Demand (≥ 80) — Fast-Track Sanction</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fa7b17' }} />
          <span>High Demand (65 – 79) — Capital Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34a853' }} />
          <span>Normal & Routine (&lt; 65)</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ISRO Bhuvan Spatial Grid'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotspots.map((item, idx) => {
          const lat = item.coordinates?.lat || 9.9252;
          const lng = item.coordinates?.lng || 78.1198;
          const score = item.hotspotScore || 70;
          const isCritical = score >= 80;
          const circleColor = isCritical ? '#ea4335' : score >= 65 ? '#fa7b17' : '#34a853';

          return (
            <React.Fragment key={idx}>
              {/* Density Circle */}
              <Circle
                center={[lat, lng]}
                radius={isCritical ? 14000 : 8000}
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: isCritical ? 0.25 : 0.15,
                  weight: 1.5
                }}
              />

              {/* Marker Pin */}
              <Marker
                position={[lat, lng]}
                icon={createHotspotIcon(score, isCritical)}
              >
                <Popup>
                  <div style={{ padding: '4px', maxWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#202124' }}>
                        {item.district}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: circleColor,
                        background: '#f1f3f4',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Score {score}/100
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#5f6368', marginBottom: '8px' }}>
                      {item.state} • {item.country || 'India'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5f6368' }}>Population:</span>
                        <span style={{ fontWeight: '600' }}>{(item.population || 1500000).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5f6368' }}>Vulnerability Index:</span>
                        <span style={{ fontWeight: '600', color: '#c5221f' }}>{item.vulnerabilityIndex || 0.72}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5f6368' }}>Primary Deficit:</span>
                        <span style={{ fontWeight: '600' }}>{item.topGrievanceCategory || 'Water & Roads'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDistrict && onSelectDistrict(item.district)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#1a73e8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Analyze in Policy Copilot
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
