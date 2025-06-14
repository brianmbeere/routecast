# Entry point for FastAPI backend
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/', response_class=HTMLResponse)
def read_root():
    return """
    <html>
      <head>
        <title>Routecast MVP</title>
        <style>
          body { background: linear-gradient(135deg, #f8fafc 0%, #c7d2fe 100%); min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: Inter, sans-serif; margin: 0; }
          h1 { font-size: 3rem; color: #3730a3; margin-bottom: 1rem; letter-spacing: 2px; }
          h2 { font-size: 1.5rem; color: #6366f1; margin-bottom: 2rem; }
          .soon { font-size: 1.2rem; color: #64748b; background: #fff; padding: 0.75rem 2rem; border-radius: 2rem; box-shadow: 0 2px 12px rgba(100,116,139,0.08); }
        </style>
      </head>
      <body>
        <h1>Routecast MVP</h1>
        <h2>AI-powered Route & Logistics Optimizer</h2>
        <div class="soon">Coming Soon 🚀</div>
      </body>
    </html>
    """

class RouteRequest(BaseModel):
    start: str
    end: str
    stops: list[str] = []
    constraints: dict = {}

@app.post('/optimize-route')
def optimize_route(request: RouteRequest):
    # For MVP, just return the input as a mock optimized route
    route = [request.start] + request.stops + [request.end]
    return {"optimized_route": route, "constraints": request.constraints}

@app.post('/api/route')
def api_route(request: RouteRequest):
    """
    Accepts JSON: {"start": ..., "end": ..., "stops": [..], "constraints": {...}}
    Returns: {"optimized_route": [..]}
    """
    route = [request.start] + request.stops + [request.end]
    return {"optimized_route": route}

@app.get('/api/example')
def api_example():
    """
    Returns an example payload for the frontend to use as a template.
    """
    return {
        "start": "Nairobi",
        "end": "Mombasa",
        "stops": ["Machakos", "Voi", "Mariakani"],
        "constraints": {}
    }
