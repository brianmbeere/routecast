# Routecast

**Intelligent Route Optimization Platform for Local Food Systems**

Routecast is a full-stack logistics platform that connects local farmers with restaurants through optimized delivery routing. Built to strengthen regional food supply chains, it reduces transportation costs, minimizes environmental impact, and provides auditable metrics for sustainable agricultural logistics.

---

## 🎯 Problem Statement

Local farms struggle to efficiently deliver produce to multiple restaurant clients. Manual route planning leads to:
- Excess fuel consumption and CO₂ emissions
- Longer delivery times affecting produce freshness
- Difficulty scaling to serve more clients
- No data-driven insights for operational improvement

---

## 🚀 Key Features

### Route Optimization Engine
- **OSRM-Backed Routing**: Integrates with Open Source Routing Machine Table API for accurate, real-world distance and duration matrices
- **Nearest-Neighbor Algorithm**: Deterministic route ordering that minimizes total travel distance
- **Haversine Fallback**: Graceful degradation using great-circle distance calculations when OSRM is unavailable
- **Multi-Stop Planning**: Optimize routes with unlimited delivery stops from a single pickup location

### Farm-to-Restaurant Marketplace
- **Produce Inventory Management**: Farmers list available produce with pricing, quantities, harvest dates, and organic certifications
- **Restaurant Request System**: Restaurants submit delivery requests with quantity needs, price limits, and delivery windows
- **Order Matching**: Sellers review and accept incoming produce requests
- **External Integration**: Webhook-based integration with Menurithm restaurant management platform

### Delivery Management
- **Route Lifecycle**: Plan → Active → Completed status tracking for all delivery routes
- **Saved Routes History**: Complete audit trail of all optimized routes with metrics
- **Accepted Orders Flow**: Automatically populate route stops from accepted produce requests

### Analytics & Reporting
- **Demand Analytics**: Track produce request trends, average quantities, and pricing patterns
- **Route Efficiency Metrics**: Monitor completion rates, average distances, and total miles traveled
- **Environmental Impact Tracking**: Calculate estimated CO₂ reduction and fuel savings from route optimization
- **Exportable Reports**: JSON export of metrics for compliance documentation and business analysis

### User Management
- **Firebase Authentication**: Secure user registration and login with token verification
- **Role-Based Access**: Distinct seller (farmer) and buyer (restaurant) user types
- **Profile Management**: Firestore-backed user profiles with compliance documentation fields

---

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with async/await support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Firebase Admin SDK for token verification
- **Geocoding**: Mapbox Geocoding API for address resolution
- **Routing**: OSRM Table API for distance/duration matrices

### Frontend (TypeScript/Preact)
- **Framework**: Preact with hooks
- **UI Library**: Material-UI (MUI) components
- **Maps**: Mapbox GL JS for interactive route visualization
- **State**: React Context for cross-component state management
- **Build**: Vite for fast development and optimized production builds

---

## 📊 Technical Highlights

| Metric | Implementation |
|--------|----------------|
| Route Optimization | O(n²) nearest-neighbor heuristic with OSRM distance matrix |
| API Response Time | Sub-second route generation for typical delivery scenarios |
| Distance Accuracy | OSRM provides road-network distances vs. straight-line estimates |
| Environmental Calc | ~15% distance savings × 0.404 kg CO₂/mile × route distance |

---

## 🔧 Environment Variables

### Backend
```bash
DATABASE_URL=postgresql://user:pass@host/database
ALLOWED_ORIGINS=https://yourfrontend.com
GEOCODER_API_KEY=your_mapbox_token
GEOCODER_PROVIDER=mapbox
OSRM_BASE_URL=https://router.project-osrm.org  # Optional
```

### Frontend
```bash
VITE_BACKEND_URL=https://yourbackend.com
VITE_MAP_BOX_API_TOKEN=your_mapbox_token
VITE_API_KEY=firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=yourapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=yourapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ / pnpm
- PostgreSQL database
- Firebase project
- Mapbox account

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configure environment variables
make run
```

### Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env  # Configure environment variables
pnpm dev
```

---

## 📁 Project Structure

```
routecast/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuration, CORS setup
│   │   ├── db/            # Database connection, SQLAlchemy
│   │   ├── models/        # SQLAlchemy models (User, Produce, Route)
│   │   ├── routes/        # API endpoints
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── services/      # Business logic (optimizer, geocode)
│   │   └── utils/         # Auth helpers, config utilities
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/           # Backend API clients
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom hooks (Firebase, Mapbox)
│   │   ├── pages/         # Route-level page components
│   │   └── types/         # TypeScript type definitions
│   └── package.json
└── docker-compose.yml
```

---

## 🌱 Impact & Vision

Routecast addresses critical inefficiencies in local food distribution:

- **Economic**: Reduces delivery costs through optimized routing, enabling small farms to serve more clients profitably
- **Environmental**: Quantifiable reduction in transportation emissions through shorter, smarter routes
- **Food Security**: Strengthens regional supply chains by making farm-to-restaurant logistics scalable
- **Data-Driven**: Provides analytics that help farmers and restaurants make informed operational decisions

---

## 📄 License

Apache 2.0 License – see [LICENSE](./LICENSE)

---

## 👤 Author

Built as a demonstration of full-stack software engineering capabilities in agricultural technology and logistics optimization.