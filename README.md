# Routecast

**Weather-Aware Route Optimization for Logistics**

Routecast helps logistics teams plan efficient delivery routes while factoring in real-time weather data. Designed for fleet managers, logistics coordinators, and delivery operators, it reduces planning time and improves ETA reliability with auditable distance and duration data from OSRM.

## 🚀 Features
- **Multi-Stop Optimization**: Input a pickup point and multiple delivery stops to get the fastest route
- **Weather-Adjusted ETAs**: Integrates live weather data to adjust ETAs and recommend alternative paths
- **Exportable Summaries**: Download route summaries and delivery timelines in PDF or CSV formats
- **Audited Travel Metrics**: OSRM Table service supplies distance and duration matrices used for route ordering and cumulative ETAs

## 📥 User Inputs
- Pickup location and delivery destinations
- Optional: Vehicle parameters and delivery windows

## 📤 Outputs
- Optimized map-based route
- Weather-aware ETAs per stop
- Downloadable delivery summary

## 🧠 Tech Stack
- **Backend**: Python (FastAPI), Geopy, OpenWeatherMap API, OSRM Table service
- **Frontend**: React.js + Leaflet.js for interactive maps

## 📦 Getting Started
1. Clone this repo
2. Set up environment variables with your API keys (weather, maps)
3. Run the backend (`uvicorn main:app --reload`)
4. Start the frontend development server
5. Access the app via `localhost`

### Route Optimization Engine
- The backend calls the OSRM Table service (defaulting to `https://router.project-osrm.org`) to obtain a fully auditable duration/distance matrix.
- Set `OSRM_BASE_URL` if you operate your own OSRM cluster or need enterprise routing guarantees.
- When OSRM is unreachable the service gracefully falls back to a haversine-based heuristic so demos still function.

## ✅ MVP Success Criteria
- Route generation completes in under 5 seconds
- ETA adjustments reflect weather conditions within ~15% accuracy
- Users report improved route reliability and reduced planning overhead

## 📄 License
Apache 2.0 License – see [LICENSE](./LICENSE)