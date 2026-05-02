from fastapi import Depends,APIRouter,Response,Request
from app.db.redis import get_connection
from app.services.auth import sessionId,setCookies
from redis.asyncio import Redis
from app.dependencies.get_current import current_user
from app.schema.user_schema import LoginSchema


router = APIRouter(tags=["SessionID"])

@router.post("/login")
async def login(data:LoginSchema,res:Response,redis:Redis=Depends(get_connection)):
   id = await sessionId(data.username,redis)
   print(id)
   setCookies(id,res)
   return {
       "message":"ok",
       "sessionId":id
       }

@router.get("/me")
async def get_cuurent_user(user = Depends(current_user)):
    return user