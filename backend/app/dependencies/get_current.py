from fastapi import Depends,Request,HTTPException

from app.services.auth import check_user
from app.db.redis import get_connection

#dependecy for check value in cookies
async def current_user(req:Request,redis=Depends(get_connection)):
    cookie_dict = req.cookies
    id = cookie_dict.get("sessionId")
    if not id:
        raise HTTPException(401,"User is not found")
    result = await check_user(str(id),redis)
    return result
    