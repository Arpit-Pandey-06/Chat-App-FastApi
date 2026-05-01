from redis.asyncio import Redis
from fastapi import HTTPException
from app.core.config import settings

client : Redis | None = None

#Establishing connection to redis
async def connection_redis():
    global client
    
    client =  await Redis.from_url(settings.REDIS_URL)
    try:
        await client.ping() # type: ignore
    except Exception as e:
        print("Error happen while creation connection with redis ",e)

# Connection Closing function
async  def connection_close_redis():

    global client
    if not client:
        raise HTTPException(404,"Connection Not Establoshed")
    await client.close()

#getting connection value
async def get_connection():
    global client
    if not client:
        raise HTTPException(404,"There is not connection in pool")

    return client