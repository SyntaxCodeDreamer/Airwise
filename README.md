# AirWise AI — GenAI Environmental Health & Smog Assistant

> **Tagline**: *Breathe Smarter. Live Healthier. Build a Cleaner Future.*  
> **Platforms**: Full-Stack Web (React + Vite + Tailwind), Android Mobile (React Native + Expo), Backend (FastAPI + Pydantic v2 + Motor/MongoDB), GenAI (Google Gemini), Real-Time Sensors (CPCB Indian NAQI Standard + Open-Meteo).

---

## 🚀 Key Features Built & Implemented

1. **Indian National AQI (NAQI) Standard Engine**:
   - Official CPCB linear interpolation sub-index calculation for **PM2.5, PM10, NO2, SO2, CO, and O3**.
   - Compliant with MoEFCC 3-pollutant threshold criteria and categorical color banding (`Good` to `Severe+`).

2. **Multilingual GenAI Guidance (Google Gemini)**:
   - Simple-language air pollution threat explanations and respiratory health impact.
   - Context-aware family vulnerability flags (Elderly, Infants, Pre-existing Asthma/COPD, HEPA Purifier).
   - Multilingual support for **English, Hindi (हिंदी), Bengali (বাংলা), and Marathi (मराठी)**.

3. **Low-Emission Daily Routine Planner**:
   - Analyzes winter thermal inversion peaks to output optimal daily time slots for errands, walking, and ventilation.

4. **Sustainable Commute & CO2 Avoidance Calculator**:
   - Computes carbon emissions (kg CO2) and respiratory smog exposure risk across Delhi Metro, Buses, Private Cars, and Cycling.

5. **Community Incident Reporting & Verification**:
   - Crowdsourced reporting of illegal garbage burning, industrial smoke, and construction dust plumes with upvoting/verification mechanics.

6. **Full-Featured User & Family Health Profile**:
   - Configurable sensitivity flags to personalize exposure alerts.

---

## 📁 Repository Structure

```
promptwars/
├── backend/                     # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/endpoints/   # /aqi, /ai, /community, /auth
│   │   ├── core/               # config.py, database.py, auth.py
│   │   ├── models/             # schemas.py (Pydantic v2)
│   │   ├── services/           # aqi_engine.py, gemini_service.py, external_aqi.py
│   │   └── main.py             # FastAPI App & Lifespan
│   ├── tests/                  # Unit & Integration pytest suite (100% passing)
│   └── requirements.txt
│
├── frontend/                    # Web Application (React 18 + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Navbar, AQICards, Gauge
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # Dashboard, AIAdvisor, CommuteTransport, Community, Profile
│   │   └── services/           # Axios API Client
│   ├── dist/                   # Production-tested compiled build
│   └── package.json
│
└── mobile/                      # Android / iOS Mobile App (React Native + Expo)
    ├── app/
    │   ├── (tabs)/             # index.tsx (AQI Dashboard), advisor.tsx (Gemini Advisor)
    │   └── _layout.tsx
    ├── components/             # MobileAQIGauge.tsx
    ├── services/               # api.ts (Expo Location & Axios)
    └── app.json
```

---

## 🛠️ Quick-Start Guide

### 1. Run Backend Server (FastAPI)
```bash
cd backend
# Optional: set GEMINI_API_KEY and MONGODB_URL in backend/.env
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Run Web Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
Open in browser: `http://localhost:3000`

### 3. Run Android Mobile App (Expo)
```bash
cd mobile
npx expo start
```
Scan the QR code with the **Expo Go** app on Android or press `a` to run in the Android Emulator.

