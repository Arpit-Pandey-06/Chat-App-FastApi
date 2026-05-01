import uuid
from redis.asyncio import Redis
from fastapi import Response,HTTPException,Request,Depends
import json
from app.dependencies.production_env import get_cookies_settings

#Creating the session Id and storing user in redis
async def sessionId(username:str,redis:Redis):
 try:
    id = uuid.uuid4()
    user_data = {
       "sessionId":str(id),
       "username":username
    }
    await redis.set(str(id),json.dumps(user_data),ex=300)
    return str(id)
 except Exception as e:
   print("Excepetion in sessionId Creation",e)
   raise HTTPException(401,"Excepiton in creation of creation sessionId")


#Creating Cookies for user with session Id
def setCookies(id:str,response:Response):
 try:
    cookies_settings = get_cookies_settings()
    print(cookies_settings["secure"],cookies_settings["samesite"])
    response.set_cookie(
        key="sessionId",
        value=id,
        httponly=True,
        secure=cookies_settings["secure"],
        samesite=cookies_settings["samesite"],
        expires=300
        )
    return {"Cookies Setup":"Seccusfully"}
 except Exception as e:
    print("error in cookies ",e)
    raise HTTPException(402,"Problem in cookies setup")
 
 #Check user is valid access or not on redis db
async def check_user(sessionId:str,redis:Redis):
    user_data = json.loads(await redis.get(sessionId))
    if not user_data:
       raise HTTPException(401,"User is not existed")
    return user_data

