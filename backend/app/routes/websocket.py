from fastapi import WebSocket,APIRouter,Depends
from app.services.auth import check_user
from app.services.event import chat_event,system_event,user_event,private_send_event
from app.schema.websocket import connection
from app.db.redis import get_connection
import json

webrouter = APIRouter()

#Websocket Route
@webrouter.websocket("/ws/chat")
async def websocket_route(websocket:WebSocket,redis=Depends(get_connection)):

    #getting Session id from cookies
    print("Cookies: ", websocket.query_params.get("sessionId"))
    session_id = websocket.query_params.get("sessionId")
    print("websocket cookie :",session_id)
    if not session_id:
         await websocket.close(code=40001,reason="cookies not have user")
         return
    
    #getting User data from redis session
    user_dict = await check_user(session_id,redis)
    if not user_dict:
        await websocket.close(code=40002,reason="redis not have user")
        return

    #Connect the websocket
    await connection.connect(user_dict["username"],websocket)
    await connection.BroadCast(system_event(f"{user_dict["username"]} joined chat"))
    await connection.BroadCast(user_event(connection.users_list))

    try:
        while True:
            print("Enters in While loop")
            data = json.loads(await websocket.receive_text())
            print(data)
            msg_type = data.get("type")
            if msg_type == "private":
                to_user = data.get("to_user")
                msg = data.get("message")
                sender = user_dict["username"]
                event = private_send_event(sender,to_user,msg)
                await connection.private_messaging(event,to_user)
                print(f"event {event}: message {msg}, sender:{sender}, recevier:{to_user}")
                if to_user != sender:
                 await connection.private_messaging(event,sender)
                print(f"event {event}: message {msg}, sender:{sender}, recevier:{to_user}")

            else :
                await connection.BroadCast(chat_event(data["message"],user_dict["username"]))
    except Exception as e:
        connection.disconnect(user_dict["username"],websocket)
        await connection.BroadCast(system_event(f"{user_dict["username"]} left chat"))
        await connection.BroadCast(user_event(connection.users_list))


    
    
    
    
