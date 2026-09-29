# 🏛️ JanDrishti AI — Digital Public Infrastructure (DPI) & Governance
> **BRICS Track 1 — AI for Digital Public Infrastructure & Governance | Theme: Innovation**

**JanDrishti AI** is a multilingual, voice-first citizen demand aggregator and geo-spatial policy recommendation engine. It bridges the gap between ground-level citizen infrastructure requests and national capital budget allocations.

---

## 🚀 Key Features

1. **Zero-App-Fatigue Citizen Ingestion**:
   - **WhatsApp Business Bot & Webhook**: Citizens report issues via Tamil, Telugu, Hindi, English, or Tanglish voice notes and photos without installing any new apps.
   - **Voice-First Web Portal**: Native Speech-to-Text with real-time waveform transcription and camera upload.

2. **Google AI Processing Layer (Evaluation Fit: 25%)**:
   - **Gemini 1.5/2.5 Flash**: Multimodal vision inspection for road craters, damaged pipes, and waterlogging. Natural language classification, sentiment scoring, and standardized English translation.
   - **Policy Copilot (Gemini Agent)**: Conversational policymaker assistant answering queries (e.g., *"Madurai South-la edhuku budget allocate panna 50k people benefit aavanga?"*) with actionable capital outlay plans and 60-day roadmaps.

3. **Spatial Data Fusion & Predictive Prioritization**:
   - Ingested civic requests are fused with **data.gov.in Census 2021** demographics and infrastructure indices.
   - **Predictive Demand Hotspot Formula**:
     $$\text{Priority Index} = 0.45 \times (\text{Complaint Density}) + 0.35 \times (\text{Demographic Vulnerability}) - 0.20 \times (\text{Existing Infra Index}) + \text{Modifiers}$$

4. **Policymaker Decision Command Center**:
   - Interactive GIS heatmap with live demand hotspot clusters (Madurai, Chennai, Varanasi, Bengaluru, Pune, Soweto - South Africa).
   - Dynamic prioritization queue with one-click budget sanctioning.

---

## 📁 Project Structure (Vercel & Cloud Ready)

The repository is structured into two clean, independent directories:

```
JANSETU-GDG/
├── backend/                  # Node.js / Express / MongoDB / Gemini AI / Webhook API
│   ├── config/               # Database connection (MongoDB Atlas + resilient local fallback)
│   ├── models/               # Grievance & Demographic Schemas
│   ├── routes/               # /api/grievances, /api/analytics, /api/policy-copilot, /api/whatsapp
│   ├── services/             # Gemini 1.5 Flash, BigQuery Data Fusion, Prioritization Engine
│   ├── seedData.js           # Seeds data.gov.in demographics and multi-lingual sample complaints
│   ├── server.js             # Main API Gateway (Port 5000)
│   ├── .env                  # Environment configuration
│   └── package.json
│
└── frontend/                 # React + Vite (Port 3000)
    ├── src/
    │   ├── components/       # Header, DashboardView, GisMap, CitizenPortalView, WhatsAppSimulatorView, PolicyCopilotDrawer, BlueprintView
    │   ├── i18n/             # Translations (English, Tamil, Hindi, Telugu)
    │   ├── App.jsx           # Main App with Google Product design system
    │   └── index.css         # Google Material 3 / Google Cloud aesthetic tokens
    ├── vite.config.js        # Configured proxy to /api
    └── package.json
```

---

## ⚙️ Quick Start (Running Locally)

### 1. Start the Backend
```bash
cd backend
npm install
npm run seed      # Seeds national demographic data & sample grievances
npm run start     # Starts backend on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev       # Starts frontend on http://localhost:3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Environment Variables (`backend/.env`)

```env
PORT=5000
# Replace <db_password> with your MongoDB Atlas database user password:
MONGODB_URI=mongodb://jkamlesh131106_db_user:<db_password>@ac-nofu3g9-shard-00-00.ddywzeb.mongodb.net:27017,ac-nofu3g9-shard-00-01.ddywzeb.mongodb.net:27017,ac-nofu3g9-shard-00-02.ddywzeb.mongodb.net:27017/?ssl=true&replicaSet=atlas-iux5dn-shard-0&authSource=admin&appName=APEX

# Google AI Studio API Key (Starts with AIzaSy...):
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT=gen-lang-client-0430258993
NODE_ENV=development
```

> **Note**: Even before entering your MongoDB Atlas password or Gemini key, the application includes a **Resilient Hybrid Fallback Engine** that stores data locally, generates AI heuristic classifications, and runs 100% reliably out of the box during evaluations!

---

## 🌍 B2G Business Model & BRICS Scalability

1. **GovTech SaaS Subscription**: Annual licenses for Smart City SPVs and Municipal Corporations.
2. **Multilateral Development Bank Advisory**: World Bank / ADB grant feasibility reports grounded in real citizen demand signals.
3. **BRICS Cross-Border Adaptability**: Ready for deployment in South Africa (e.g. Soweto water infrastructure) and Brazil (favela sanitation) with modular language packs.
