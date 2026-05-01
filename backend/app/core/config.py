from pydantic_settings import BaseSettings,SettingsConfigDict



class Settings(BaseSettings):
  REDIS_URL:str
  PRODUCTION:bool
      
  model_config = SettingsConfigDict(
    env_file=".env"
  )



settings = Settings()  # type: ignore
