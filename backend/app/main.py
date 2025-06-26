import os
from fastapi import FastAPI
import uvicorn
from app.core.config import setup_cors
from app.routes import route,views

app = FastAPI()

# Add CORS, middleware, etc
setup_cors(app)

# Register routers
app.include_router(views.router)
app.include_router(route.router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
