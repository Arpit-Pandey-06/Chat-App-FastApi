from app.core.config import settings

def get_cookies_settings():
    if settings.PRODUCTION == True:
        return {
            "secure":True,
            "samesite":"none",
            "expire":300
        }
    else:
        return{
            "secure":False,
            "samesite":"lax",
            "expire":300
        }