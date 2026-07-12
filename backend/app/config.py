from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    auto_emission_calc: bool = True
    evidence_required: bool = True
    badge_auto_award: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
