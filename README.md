# Routecast

**Weather-Aware Route Optimization for Logistics**

Routecast helps logistics teams plan efficient delivery routes while factoring in real-time weather data. Designed for fleet managers, logistics coordinators, and delivery operators, it reduces planning time and improves ETA reliability.

## 🚀 Features
- **Multi-Stop Optimization**: Input a pickup point and multiple delivery stops to get the fastest route
- **Weather-Adjusted ETAs**: Integrates live weather data to adjust ETAs and recommend alternative paths
- **Exportable Summaries**: Download route summaries and delivery timelines in PDF or CSV formats

## 📥 User Inputs
- Pickup location and delivery destinations
- Optional: Vehicle parameters and delivery windows

## 📤 Outputs
- Optimized map-based route
- Weather-aware ETAs per stop
- Downloadable delivery summary

## 🧠 Tech Stack
- **Backend**: Python (FastAPI), Geopy, OpenWeatherMap API
- **Frontend**: React.js + Leaflet.js for interactive maps

## 📦 Getting Started
1. Clone this repo
2. Set up environment variables with your API keys (weather, maps)
3. Run the backend (`uvicorn main:app --reload`)
4. Start the frontend development server
5. Access the app via `localhost`

## ✅ MVP Success Criteria
- Route generation completes in under 5 seconds
- ETA adjustments reflect weather conditions within ~15% accuracy
- Users report improved route reliability and reduced planning overhead

## 📄 License
Apache 2.0 License – see [LICENSE](./LICENSE)