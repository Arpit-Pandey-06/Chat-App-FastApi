from fastapi import WebSocket
import json
from fastapi import logger

class Connection:
    #constructor make the empty list of active connection
    def __init__(self) -> None:
        self.active_connection : dict = {}
        self.users_list = set()
    
    # Connection manager
    async def connect(self,username:str,websocket:WebSocket):
        await websocket.accept()
        if username not in self.active_connection:
            self.active_connection[username]=websocket
            self.users_list.add(username)
            
    # Disconnection manager
    def disconnect(self,username:str,websocket:WebSocket):
       if username in self.active_connection:
           if websocket in self.active_connection[username]:
               del self.active_connection[username]
               self.users_list.discard(username)
                                             
    # Global Msg Braodcaster
    async def BroadCast(self,data:dict):
        disconnect = []
        for username,socects in self.active_connection.items():
                try:
                     await socects.send_text(json.dumps(data))
                except:
                    disconnect.append((username,socects))
        for id,socects in disconnect:
            self.disconnect(id,socects)

    # User to User Private Dm messenger
    async def private_messaging(self,event:dict,username:str):
        if username in self.active_connection:
            ws = self.active_connection[username]
            await ws.send_text(json.dumps(event))
            
            
            
        
        
    

connection = Connection()

    