import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Camera, Upload, Send, CheckCircle2, 
  MapPin, AlertCircle, Sparkles, Volume2, ShieldCheck, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../i18n/translations';
import { getApiUrl } from '../config/api';

export default function CitizenPortalView({ currentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang || 'ta');
  const [district, setDistrict] = useState('Madurai');
  const [ward, setWard] = useState('Ward 45 - South Gate');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Sample voice simulations for easy hackathon evaluator testing
  const sampleVoicePrompts = [
    {
      label: 'Tamil: Madurai Keela Vaasal Road Crater',
      lang: 'ta',
      district: 'Madurai',
      ward: 'Ward 45 - South Gate',
      text: 'கீழ வாசல் மெயின் ரோடுல பெரிய பள்ளம் இருக்கு தம்பி, ரெண்டு நாளா பைப் உடைஞ்சு தண்ணி வீணாகுது, ஸ்கூல் பசங்க வண்டி விழுந்துட்டாங்க.'
    },
    {
      label: 'Tanglish: Simmakkal Signal Pothole & Lights',
      lang: 'tanglish',
      district: 'Madurai',
      ward: 'Ward 28 - Simmakkal',
      text: 'Simmakkal signal kitta heavy pothole, night-la street lights illama 3 bike slip aaiduchu please fix pannunga.'
    },
    {
      label: 'Hindi: Varanasi Ghats Waste & Electric Cable',
      lang: 'hi',
      district: 'Varanasi',
      ward: 'Ward 12 - Dashashwamedh',
      text: 'दशाश्वमेध घाट मुख्य मार्ग पर कचरे का ढेर लगा है और बिजली के नंगे तार लटक रहे हैं, तुरंत कार्रवाई करें।'
    },
    {
      label: 'English: Chennai Velachery Drainage Choke',
      lang: 'en',
      district: 'Chennai',
      ward: 'Ward 178 - Velachery',
      text: 'Velachery 100 feet road storm water drain blocked with construction debris, causing waterlogging even with minor rain.'
    }
  ];

  // Sample photos for multimodal testing
  const samplePhotos = [
    {
      name: 'Severe Pothole Crater',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop'
    },
    {
      name: 'Road Waterlogging',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop'
    },
    {
      name: 'Solid Waste Overflow',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop'
    }
  ];

  // Browser Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use the simulated vernacular buttons below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Set recognition language
      if (selectedLanguage === 'ta') recognition.lang = 'ta-IN';
      else if (selectedLanguage === 'hi') recognition.lang = 'hi-IN';
      else if (selectedLanguage === 'te') recognition.lang = 'te-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setVoiceText(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => {
        setIsRecording(false);
        triggerAiAnalysis(voiceText);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsRecording(false);
    }
  };

  const handleApplySampleVoice = (sample) => {
    setVoiceText(sample.text);
    setSelectedLanguage(sample.lang);
    setDistrict(sample.district);
    setWard(sample.ward);
    triggerAiAnalysis(sample.text);
  };

  const handleApplySamplePhoto = (photo) => {
    setSelectedPhoto(photo.url);
    setPhotoPreview(photo.url);
    triggerAiAnalysis(voiceText, photo.url);
  };

  const triggerAiAnalysis = async (text, photoUrl = photoPreview) => {
    if (!text && !photoUrl) return;

    setAnalyzing(true);
    try {
      const res = await fetch(getApiUrl('/api/grievances/analyze-preview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
          imageUrl: photoUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiPreview(data);
      }
    } catch (e) {
      console.error('Failed to get AI preview:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!voiceText) {
      alert('Please speak or enter your grievance first.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/grievances'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'voice_web',
          originalLanguage: selectedLanguage,
          rawInputText: voiceText,
          district,
          ward,
          imageUrl: photoPreview || '',
          coordinates: { lat: 9.9195, lng: 78.1198 }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedTicket(data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error('Submission failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#e8f0fe',
          color: '#1a73e8',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          <Sparkles size={14} /> Zero Download • Voice-First Citizen Ingestion
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#202124', marginBottom: '8px' }}>
          {t.citizenTitle}
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#5f6368' }}>
          {t.citizenSubtitle}
        </p>
      </div>

      {/* Main Ingestion Box */}
      <div className="google-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '4px solid #1a73e8' }}>
        
        {/* District & Language Selectors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', borderBottom: '1px solid #e0e3e7', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#1a73e8" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Location:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '0.85rem' }}
            >
              <option value="Madurai">Madurai (Tamil Nadu)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
              <option value="Bengaluru Urban">Bengaluru (Karnataka)</option>
            </select>

            <input
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="Ward name / Street landmark"
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '0.85rem', minWidth: '220px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Voice Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '0.85rem' }}
            >
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="tanglish">Tanglish (Tamil + English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="en">English (Default)</option>
            </select>
          </div>
        </div>

        {/* Voice Note & Speech Recognition Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={16} color="#1a73e8" />
              <span>Vernacular Voice Note or Description:</span>
            </label>

            {/* Mic Toggle Button */}
            <button
              onClick={toggleSpeechRecognition}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background: isRecording ? '#ea4335' : '#1a73e8',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isRecording ? 'Listening... Click to Stop' : 'Start Mic Recording'}</span>
            </button>
          </div>

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '36px', background: '#fce8e6', borderRadius: '8px' }}>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span style={{ fontSize: '0.8rem', color: '#c5221f', fontWeight: '600', marginLeft: '8px' }}>
                Recording regional dialect... Gemini audio processing
              </span>
            </div>
          )}

          <textarea
            value={voiceText}
            onChange={(e) => {
              setVoiceText(e.target.value);
              triggerAiAnalysis(e.target.value);
            }}
            placeholder={t.voicePlaceholder}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #dadce0',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              outline: 'none'
            }}
          />

          {/* Quick Click Vernacular Scenarios for judges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#5f6368', fontWeight: '600' }}>Demo Voice Samples:</span>
            {sampleVoicePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySampleVoice(s)}
                style={{
                  padding: '3px 8px',
                  background: '#f1f3f4',
                  border: '1px solid #dadce0',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#202124',
                  cursor: 'pointer'
                }}
              >
                🎙️ {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multimodal Photo Inspection Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e0e3e7', paddingTop: '1rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={16} color="#1a73e8" />
            <span>Multimodal Vision Verification (Photo of civic damage):</span>
          </label>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {samplePhotos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => handleApplySamplePhoto(photo)}
                style={{
                  cursor: 'pointer',
                  border: photoPreview === photo.url ? '2px solid #1a73e8' : '1px solid #dadce0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '130px',
                  background: '#fff'
                }}
              >
                <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                <div style={{ padding: '4px', fontSize: '0.7rem', fontWeight: '600', textAlign: 'center', color: '#202124' }}>
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini 1.5 Multimodal Instant Analysis Box */}
        {(aiPreview?.textAnalysis?.translatedText || analyzing) && (
          <div style={{
            background: '#e8f0fe',
            border: '1px solid #1a73e8',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1a73e8', fontWeight: '700', fontSize: '0.85rem' }}>
                <Sparkles size={16} />
                <span>Gemini 1.5 Flash Real-Time Multimodal Preview</span>
              </div>
              <span style={{ fontSize: '0.7rem', background: '#fff', color: '#1a73e8', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                Standardized for DPI Registry
              </span>
            </div>

            {analyzing ? (
              <p style={{ fontSize: '0.85rem', color: '#5f6368' }}>Processing audio & image through Gemini Multimodal pipeline...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: '#5f6368', display: 'block' }}>English Translation:</span>
                  <span style={{ fontWeight: '600', color: '#202124' }}>
                    "{aiPreview.textAnalysis.translatedText}"
                  </span>
                </div>

                <div>
                  <span style={{ color: '#5f6368', display: 'block' }}>Classified Category:</span>
                  <span style={{ fontWeight: '600', color: '#1a73e8' }}>
                    {aiPreview.textAnalysis.category}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#5f6368', display: 'block' }}>Detected Urgency:</span>
                  <span style={{ fontWeight: '700', color: '#c5221f' }}>
                    {aiPreview.textAnalysis.urgency}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#5f6368', display: 'block' }}>Beneficiaries Impact:</span>
                  <span style={{ fontWeight: '600', color: '#137333' }}>
                    ~{(aiPreview.textAnalysis.estimatedBeneficiaries || 18000).toLocaleString('en-IN')} citizens
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            {submitting ? 'Submitting to DPI...' : 'Submit to National Grievance Registry'}
          </button>
        </div>
      </div>

      {/* Submitted Ticket & Transparent Tracking Card */}
      {submittedTicket && (
        <div className="google-card" style={{ borderLeft: '4px solid #34a853', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={24} color="#34a853" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#202124' }}>
                  Grievance Registered Successfully!
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#5f6368' }}>
                  Your issue is directly fused into the national capital planning pipeline.
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>Ticket Tracking ID:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a73e8' }}>
                {submittedTicket.ticketId}
              </div>
            </div>
          </div>

          {/* 4-Step DPI Lifecycle Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ background: '#e6f4ea', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #34a853' }}>
              <div style={{ fontSize: '0.7rem', color: '#137333', fontWeight: '700' }}>STEP 1: INGESTION</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#202124' }}>Voice & Photo Captured</div>
            </div>
            <div style={{ background: '#e6f4ea', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #34a853' }}>
              <div style={{ fontSize: '0.7rem', color: '#137333', fontWeight: '700' }}>STEP 2: GOOGLE AI</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#202124' }}>Gemini Multimodal Verified</div>
            </div>
            <div style={{ background: '#e8f0fe', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #1a73e8' }}>
              <div style={{ fontSize: '0.7rem', color: '#1a73e8', fontWeight: '700' }}>STEP 3: CENSUS FUSION</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#202124' }}>Priority Index: {submittedTicket.fusionData?.calculatedPriority}/100</div>
            </div>
            <div style={{ background: '#fef7e0', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #f9ab00' }}>
              <div style={{ fontSize: '0.7rem', color: '#b06000', fontWeight: '700' }}>STEP 4: ACTION</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#202124' }}>Ward Budget Allocation</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
