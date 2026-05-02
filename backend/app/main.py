from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.redis import connection_redis,connection_close_redis
from app.routes.session import router
from app.routes.websocket import webrouter
import uvicorn
@asynccontextmanager
async def lifespan(app:FastAPI):
    #startup
    await connection_redis()
    yield
    #close
    await connection_close_redis()

app = FastAPI(lifespan=lifespan)
origins = [
    "http://localhost:5173", 
    "https://chatter-beryl-nine.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )

app.include_router(router)
app.include_router(webrouter)

@app.get("/ping")
async def ping():
    return {"message":"pong"}

if __name__ == "__main__":
    uvicorn.run("app.main:app",host="0.0.0.0",port=8000)
