from fastapi import HTTPException
import json

def chat_event(msg:str,user:str):
    return {
        "type":"chat",
        "message":msg,
        "user":user
    }

def system_event(msg:str):
    return{
        "type":"system",
        "message":msg
    }

def user_event(users:set):
    return {
        "type":"users",
        "users":list(users)
    }

def private_send_event(username:str,to_user:str,msg:str):
    return {
        "type" : "private",
        "from":username,
        "to_user":to_user,
        "message":msg
    }